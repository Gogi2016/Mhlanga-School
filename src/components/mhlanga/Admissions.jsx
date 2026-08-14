import React, { useRef, useState } from 'react';
import {
  Check,
  FileText,
  Upload,
  X,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Users,
  GraduationCap,
  CreditCard,
  AlertCircle,
} from 'lucide-react';

import { supabase } from '../../lib/Supabase';
import { sendApplicationReceivedEmail } from '../../lib/Emailjs';

const EMPTY = {
  fullName: '',
  dob: '',
  idNumber: '',
  email: '',
  contactNo: '',
  homeAddress: '',
  race: '',
  gender: '',
  guardianName: '',
  guardianId: '',
  guardianContactNo: '',
  gradeApplying: '',
  stream: '',
  juneResults: '',
  decemberResults: '',
};

const RACE_OPTIONS = [
  '',
  'African',
  'Coloured',
  'Indian',
  'White',
  'Other',
];

const GENDER_OPTIONS = [
  '',
  'Female',
  'Male',
  'Other',
];

const GRADE_OPTIONS = [
  '',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
];

const DOCUMENT_TYPES = [
  '',
  'ID Copy',
  'Parent ID',
  'Birth Certificate',
  'Report Card',
  'Proof of Residence',
  'Other',
];

const STREAM_REQUIRED_GRADES = [
  'Grade 10',
  'Grade 11',
  'Grade 12',
];

const STREAMS = [
  {
    code: 'A1',
    name: 'Mathematics & Physical Sciences',
    subjects: [
      'Mathematics',
      'Physical Sciences',
      'Life Sciences',
      'Geography',
    ],
  },
  {
    code: 'A2',
    name: 'Agricultural Sciences',
    subjects: [
      'Mathematics',
      'Agricultural Sciences',
      'Life Sciences',
      'Physical Sciences',
    ],
  },
  {
    code: 'A3',
    name: 'Humanities & Geography',
    subjects: [
      'Maths Literacy',
      'Geography',
      'Agricultural Sciences',
      'History',
    ],
  },
  {
    code: 'A4',
    name: 'Commerce',
    subjects: [
      'Accounting',
      'Business Studies',
      'Economics',
      'Mathematics',
    ],
  },
];

// --------------------------------------------------
// Validation helpers
// --------------------------------------------------

const validators = {
  idNumber: (v) => {
    if (!v) return 'ID number is required';

    const cleaned = v.replace(/\s/g, '');

    if (!/^\d{13}$/.test(cleaned)) {
      return 'Enter a valid 13-digit ID number';
    }

    return '';
  },

  email: (v) => {
    if (!v) return 'Email address is required';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return 'Enter a valid email address';
    }

    return '';
  },

  contactNo: (v) => {
    if (!v) return 'Contact number is required';

    const cleaned = v.replace(/\s/g, '');

    if (!/^(\+27|0)\d{9}$/.test(cleaned)) {
      return 'Enter a valid SA number, e.g. 072 915 5354';
    }

    return '';
  },

  guardianContactNo: (v) => {
    if (!v) return 'Guardian contact number is required';

    const cleaned = v.replace(/\s/g, '');

    if (!/^(\+27|0)\d{9}$/.test(cleaned)) {
      return 'Enter a valid SA number, e.g. 072 915 5354';
    }

    return '';
  },
};

export default function Admissions() {
  const [data, setData] = useState(EMPTY);

  const [touched, setTouched] = useState({});

  const [docType, setDocType] = useState('');

  const [pendingFiles, setPendingFiles] = useState([]);

  const [uploadedDocs, setUploadedDocs] = useState([]);

  const [submitted, setSubmitted] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState('');

  const fileInputRef = useRef(null);

  const dobInputRef = useRef(null);

  const set = (key, value) => {
    setData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const touch = (key) => {
    setTouched((current) => ({
      ...current,
      [key]: true,
    }));
  };

  const errorFor = (key) => {
    if (!validators[key]) {
      return '';
    }

    return validators[key](data[key]);
  };

  const showError = (key) => {
    return touched[key] ? errorFor(key) : '';
  };

  const needsStream = STREAM_REQUIRED_GRADES.includes(
    data.gradeApplying
  );

  const handleGradeChange = (value) => {
    setData((current) => ({
      ...current,
      gradeApplying: value,
      stream: STREAM_REQUIRED_GRADES.includes(value)
        ? current.stream
        : '',
    }));
  };

  // --------------------------------------------------
  // Document handling
  // --------------------------------------------------

  const handleFileChange = (event) => {
    setPendingFiles(
      Array.from(event.target.files || [])
    );
  };

  const handleUploadDocument = () => {
    if (!docType || pendingFiles.length === 0) {
      return;
    }

    const newDocs = pendingFiles.map((file) => ({
      type: docType,
      name: file.name,
    }));

    setUploadedDocs((documents) => [
      ...documents,
      ...newDocs,
    ]);

    setPendingFiles([]);
    setDocType('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeDoc = (index) => {
    setUploadedDocs((documents) =>
      documents.filter((_, i) => i !== index)
    );
  };

  // --------------------------------------------------
  // Form validation
  // --------------------------------------------------

  const validationOk =
    !errorFor('idNumber') &&
    !errorFor('email') &&
    !errorFor('contactNo') &&
    !errorFor('guardianContactNo');

  const canSubmit =
    data.fullName &&
    data.idNumber &&
    data.email &&
    data.contactNo &&
    data.guardianName &&
    data.guardianContactNo &&
    data.gradeApplying &&
    (!needsStream || data.stream) &&
    validationOk;

  // --------------------------------------------------
  // Submit application
  // --------------------------------------------------

  const submit = async (event) => {
    event.preventDefault();

    setTouched({
      idNumber: true,
      email: true,
      contactNo: true,
      guardianContactNo: true,
    });

    setSubmitError('');

    if (!canSubmit || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      // Generate application reference
      const ref =
        'MSS-' +
        Date.now().toString().slice(-6);

      // Prepare application for Supabase
      const application = {
        reference_number: ref,

        full_name: data.fullName,

        date_of_birth: data.dob || null,

        id_number: data.idNumber,

        email: data.email,

        contact_number: data.contactNo,

        home_address:
          data.homeAddress || null,

        race:
          data.race || null,

        gender:
          data.gender || null,

        guardian_name:
          data.guardianName,

        guardian_id:
          data.guardianId || null,

        guardian_contact_number:
          data.guardianContactNo,

        grade_applying:
          data.gradeApplying,

        stream:
          data.stream || null,

        june_results:
          data.juneResults || null,

        december_results:
          data.decemberResults || null,

        documents:
          uploadedDocs,

        status:
          'Application submitted',

        submitted_at:
          new Date().toISOString(),
      };

      console.log(
        'Submitting application:',
        application
      );

      // ----------------------------------------------
      // Save application to Supabase
      //
      // IMPORTANT:
      // We intentionally DO NOT use:
      // .select()
      //
      // This means the public applicant only needs
      // INSERT permission and does not need SELECT
      // permission on the admissions table.
      // ----------------------------------------------

      const { error } = await supabase
        .from('admissions')
        .insert([application]);

      if (error) {
        console.error(
          'Supabase application error:',
          error
        );

        throw new Error(
          error.message ||
            'Unable to save your application.'
        );
      }

      // ----------------------------------------------
      // Send confirmation email
      // ----------------------------------------------
      const streamLabel = data.stream
        ? STREAMS.find((s) => s.code === data.stream)?.name
          ? `${data.stream} · ${STREAMS.find((s) => s.code === data.stream).name}`
          : data.stream
        : 'N/A';

      const emailResult =
        await sendApplicationReceivedEmail({
          toEmail: data.email,
          toName: data.fullName,
          ref,
          gradeApplying: data.gradeApplying,
        });

      if (!emailResult.ok) {
        console.warn(
          'Application saved, but confirmation email could not be sent.',
          emailResult.error
        );
      }

      // ----------------------------------------------
      // Show success screen
      // ----------------------------------------------

      setSubmitted({
        ...data,
        documents: uploadedDocs,
        ref,
        submittedAt:
          application.submitted_at,
        emailSent:
          emailResult.ok,
      });

    } catch (error) {
      console.error(
        'Application submission failed:',
        error
      );

      setSubmitError(
        error.message ||
          'Something went wrong while submitting your application. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Reset form
  // --------------------------------------------------

  const reset = () => {
    setSubmitted(null);

    setData(EMPTY);

    setTouched({});

    setUploadedDocs([]);

    setPendingFiles([]);

    setDocType('');

    setSubmitError('');
  };

  // --------------------------------------------------
  // Date picker
  // --------------------------------------------------

  const openDatePicker = () => {
    if (dobInputRef.current?.showPicker) {
      dobInputRef.current.showPicker();
    } else {
      dobInputRef.current?.focus();
    }
  };

  return (
    <section
      id="apply"
      className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-6xl mx-auto"
    >
      {/* --------------------------------------------------
          Header
      -------------------------------------------------- */}

      <div className="text-center mb-14">
        <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">
          Online Admission Portal · 2027
        </p>

        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight mb-5">
          GRADE 8–12 ADMISSIONS
          <br />
          NOW OPEN.
        </h2>

        <p className="text-[#F4F4F4]/65 max-w-xl mx-auto">
          Complete the school admission form below.
          Your application will be securely submitted
          to Mhlanga Senior Secondary School.
        </p>
      </div>

      {submitted ? (
        <SuccessCard
          refNumber={submitted.ref}
          data={submitted}
          onReset={reset}
        />
      ) : (
        <div className="glass p-7 sm:p-12">

          <form
            onSubmit={submit}
            className="space-y-14"
          >

            {/* --------------------------------------------------
                Applicant Details
            -------------------------------------------------- */}

            <FormSection
              num="01"
              title="Applicant Details"
              icon={<User size={16} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <Field
                  label="Full Names"
                  icon={<User size={14} />}
                  value={data.fullName}
                  onChange={(value) =>
                    set('fullName', value)
                  }
                  placeholder="Enter your full names"
                  required
                />

                <div>
                  <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">
                    Date of Birth{' '}
                    <span className="text-[#D27D2D]">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <span
                      className="absolute top-1/2 -translate-y-1/2 text-[#F4F4F4]/40 pointer-events-none flex items-center"
                      style={{ left: '2px' }}
                    >
                      <Calendar size={14} />
                    </span>

                    <input
                      ref={dobInputRef}
                      type="date"
                      className="line-input"
                      style={{
                        paddingLeft: '1.75rem',
                      }}
                      value={data.dob}
                      onChange={(event) =>
                        set(
                          'dob',
                          event.target.value
                        )
                      }
                      onClick={openDatePicker}
                    />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <Field
                  label="ID Number"
                  icon={<CreditCard size={14} />}
                  value={data.idNumber}
                  onChange={(value) =>
                    set(
                      'idNumber',
                      value
                        .replace(/[^\d]/g, '')
                        .slice(0, 13)
                    )
                  }
                  onBlur={() =>
                    touch('idNumber')
                  }
                  placeholder="13-digit SA ID number"
                  required
                  error={showError('idNumber')}
                />

                <Field
                  label="Email Address"
                  icon={<Mail size={14} />}
                  type="email"
                  value={data.email}
                  onChange={(value) =>
                    set('email', value)
                  }
                  onBlur={() =>
                    touch('email')
                  }
                  placeholder="you@example.com"
                  required
                  error={showError('email')}
                />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <Field
                  label="Contact No"
                  icon={<Phone size={14} />}
                  type="tel"
                  value={data.contactNo}
                  onChange={(value) =>
                    set(
                      'contactNo',
                      value
                    )
                  }
                  onBlur={() =>
                    touch('contactNo')
                  }
                  placeholder="072 915 5354"
                  required
                  error={showError(
                    'contactNo'
                  )}
                />

                <Field
                  label="Home Address"
                  icon={<MapPin size={14} />}
                  value={data.homeAddress}
                  onChange={(value) =>
                    set(
                      'homeAddress',
                      value
                    )
                  }
                  placeholder="Enter your home address"
                />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <SelectField
                  label="Race"
                  value={data.race}
                  onChange={(value) =>
                    set('race', value)
                  }
                  options={RACE_OPTIONS}
                />

                <SelectField
                  label="Gender"
                  value={data.gender}
                  onChange={(value) =>
                    set('gender', value)
                  }
                  options={GENDER_OPTIONS}
                />

              </div>
            </FormSection>

            {/* --------------------------------------------------
                Guardian Details
            -------------------------------------------------- */}

            <FormSection
              num="02"
              title="Guardian Details"
              icon={<Users size={16} />}
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <Field
                  label="Guardian's Full Names"
                  icon={<User size={14} />}
                  value={data.guardianName}
                  onChange={(value) =>
                    set(
                      'guardianName',
                      value
                    )
                  }
                  placeholder="Guardian's full names"
                  required
                />

                <Field
                  label="Guardian's ID Number"
                  icon={<CreditCard size={14} />}
                  value={data.guardianId}
                  onChange={(value) =>
                    set(
                      'guardianId',
                      value
                        .replace(/[^\d]/g, '')
                        .slice(0, 13)
                    )
                  }
                  placeholder="Guardian's ID number"
                />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <Field
                  label="Contact No"
                  icon={<Phone size={14} />}
                  type="tel"
                  value={
                    data.guardianContactNo
                  }
                  onChange={(value) =>
                    set(
                      'guardianContactNo',
                      value
                    )
                  }
                  onBlur={() =>
                    touch(
                      'guardianContactNo'
                    )
                  }
                  placeholder="072 915 5354"
                  required
                  error={showError(
                    'guardianContactNo'
                  )}
                />

              </div>

            </FormSection>

            {/* --------------------------------------------------
                Academic Information
            -------------------------------------------------- */}

            <FormSection
              num="03"
              title="Academic Information"
              icon={
                <GraduationCap size={16} />
              }
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <SelectField
                  label="Applying for Grade"
                  value={
                    data.gradeApplying
                  }
                  onChange={
                    handleGradeChange
                  }
                  options={
                    GRADE_OPTIONS
                  }
                  required
                />

              </div>

              {needsStream && (
                <div>

                  <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-3 block">
                    Preferred Stream{' '}
                    <span className="text-[#D27D2D]">
                      *
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {STREAMS.map((stream) => {
                      const selected =
                        data.stream ===
                        stream.code;

                      return (
                        <button
                          type="button"
                          key={stream.code}
                          onClick={() =>
                            set(
                              'stream',
                              stream.code
                            )
                          }
                          className={`text-left border p-4 transition-colors ${
                            selected
                              ? 'border-[#00A3AD] bg-[#00A3AD]/[0.06]'
                              : 'border-white/15 hover:border-white/30'
                          }`}
                        >

                          <div className="flex items-center justify-between mb-2">

                            <span
                              className={`font-display text-sm tracking-wide ${
                                selected
                                  ? 'text-[#00A3AD]'
                                  : 'text-[#F4F4F4]/80'
                              }`}
                            >
                              {stream.code} ·{' '}
                              {stream.name}
                            </span>

                            {selected && (
                              <Check
                                size={14}
                                className="text-[#00A3AD] shrink-0"
                              />
                            )}

                          </div>

                          <p className="text-xs text-[#F4F4F4]/45 leading-relaxed">
                            {stream.subjects.join(
                              ' · '
                            )}
                          </p>

                        </button>
                      );
                    })}

                  </div>

                  {!data.stream && (
                    <p className="flex items-center gap-2 text-xs text-[#D27D2D] mt-3">
                      <AlertCircle size={13} />
                      Please select the stream
                      you're applying for.
                    </p>
                  )}

                </div>
              )}

            </FormSection>

            {/* --------------------------------------------------
                Results
            -------------------------------------------------- */}

            <FormSection
              num="04"
              title="June and December Results"
              icon={<FileText size={16} />}
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <TextAreaField
                  label="June Results (Subject - Percentage)"
                  value={
                    data.juneResults
                  }
                  onChange={(value) =>
                    set(
                      'juneResults',
                      value
                    )
                  }
                />

                <TextAreaField
                  label="December Results (Subject - Percentage)"
                  value={
                    data.decemberResults
                  }
                  onChange={(value) =>
                    set(
                      'decemberResults',
                      value
                    )
                  }
                />

              </div>

            </FormSection>

            {/* --------------------------------------------------
                Document Upload
            -------------------------------------------------- */}

            <FormSection
              num="05"
              title="Document Upload"
              icon={<Upload size={16} />}
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">

                <SelectField
                  label="Select Document Type"
                  value={docType}
                  onChange={setDocType}
                  options={
                    DOCUMENT_TYPES
                  }
                />

                <div>

                  <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 flex items-center gap-2">
                    <Upload size={14} />
                    Upload Document
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={
                      handleFileChange
                    }
                    className="line-input file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:tracking-widest file:uppercase file:bg-[#00A3AD] file:text-[#121416] file:cursor-pointer cursor-pointer"
                  />

                </div>

              </div>

              <p className="text-xs text-[#F4F4F4]/40">
                You can upload multiple
                documents at once. Ensure you
                select the correct document type
                before uploading.
              </p>

              <button
                type="button"
                onClick={
                  handleUploadDocument
                }
                disabled={
                  !docType ||
                  pendingFiles.length === 0
                }
                className="portal-btn font-display text-sm tracking-wide px-7 py-3 bg-[#00A3AD] text-[#121416] disabled:opacity-30 disabled:cursor-not-allowed w-fit"
              >
                Upload Document
              </button>

              {uploadedDocs.length > 0 && (
                <div>

                  <h4 className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-3">
                    Uploaded Documents
                  </h4>

                  <div className="space-y-2">

                    {uploadedDocs.map(
                      (doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4 border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <FileText
                              size={14}
                              className="text-[#00A3AD] shrink-0"
                            />

                            <span className="text-[#F4F4F4]/85 truncate">
                              {doc.name}
                            </span>

                            <span className="text-[#F4F4F4]/40 text-xs shrink-0">
                              ({doc.type})
                            </span>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeDoc(index)
                            }
                            className="text-[#F4F4F4]/40 hover:text-[#D27D2D] transition-colors shrink-0"
                          >
                            <X size={14} />
                          </button>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </FormSection>

            {/* --------------------------------------------------
                Submit Error
            -------------------------------------------------- */}

            {submitError && (
              <div className="border border-[#D27D2D]/40 bg-[#D27D2D]/[0.06] px-5 py-4">

                <p className="flex items-start gap-3 text-sm text-[#F4F4F4]/80">

                  <AlertCircle
                    size={18}
                    className="text-[#D27D2D] shrink-0 mt-0.5"
                  />

                  <span>
                    {submitError}
                  </span>

                </p>

              </div>
            )}

            {/* --------------------------------------------------
                Submit
            -------------------------------------------------- */}

            <div className="flex flex-col items-center gap-3 pt-4">

              {!validationOk && (
                <p className="flex items-center gap-2 text-xs text-[#D27D2D]">
                  <AlertCircle size={13} />
                  Please fix the highlighted
                  fields before submitting.
                </p>
              )}

              <button
                type="submit"
                disabled={
                  !canSubmit ||
                  submitting
                }
                className="portal-btn font-display text-sm tracking-wide px-9 py-4 bg-[#00A3AD] text-[#121416] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {submitting
                  ? 'Submitting Application...'
                  : 'Submit Application →'}
              </button>

            </div>

          </form>

        </div>
      )}
    </section>
  );
}

// ======================================================
// Form Section
// ======================================================

function FormSection({
  num,
  title,
  icon,
  children,
}) {
  return (
    <div className="border border-white/10 bg-white/[0.015] p-6 sm:p-8">

      <div className="flex items-center gap-4 mb-7 pb-4 border-b border-white/10">

        <span className="w-8 h-8 shrink-0 flex items-center justify-center border border-[#00A3AD]/40 text-[#00A3AD] text-xs font-display tracking-wider">
          {num}
        </span>

        <h3 className="font-display text-xl sm:text-2xl tracking-tight flex items-center gap-3">
          {title}
        </h3>

        <span className="text-[#F4F4F4]/25 ml-auto hidden sm:block">
          {icon}
        </span>

      </div>

      <div className="space-y-6">
        {children}
      </div>

    </div>
  );
}

// ======================================================
// Input Field
// ======================================================

function Field({
  label,
  icon,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  required,
  error,
}) {
  return (
    <div>

      <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">

        {label}{' '}

        {required && (
          <span className="text-[#D27D2D]">
            *
          </span>
        )}

      </label>

      <div className="relative">

        {icon && (
          <span
            className="absolute top-1/2 -translate-y-1/2 text-[#F4F4F4]/40 pointer-events-none flex items-center"
            style={{ left: '2px' }}
          >
            {icon}
          </span>
        )}

        <input
          className={`line-input ${
            error
              ? 'border-b-[#D27D2D]'
              : ''
          }`}
          style={
            icon
              ? {
                  paddingLeft:
                    '1.75rem',
                }
              : undefined
          }
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          onBlur={onBlur}
        />

      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-[#D27D2D] mt-1.5">
          <AlertCircle size={12} />
          {error}
        </p>
      )}

    </div>
  );
}

// ======================================================
// Text Area
// ======================================================

function TextAreaField({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-2 block">
        {label}
      </label>

      <textarea
        rows={4}
        className="w-full bg-[#0A0B0C] border border-white/20 focus:border-[#00A3AD] focus:outline-none text-[#F4F4F4] placeholder:text-[#F4F4F4]/30 px-3 py-2.5 text-sm resize-y transition-colors"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder="e.g. Mathematics - 78%"
      />

    </div>
  );
}

// ======================================================
// Select Field
// ======================================================

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}) {
  return (
    <div>

      <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">

        {label}{' '}

        {required && (
          <span className="text-[#D27D2D]">
            *
          </span>
        )}

      </label>

      <select
        className="line-input bg-transparent"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="basalt-bg text-[#F4F4F4]"
          >
            {option || 'Select…'}
          </option>
        ))}

      </select>

    </div>
  );
}

// ======================================================
// Success Card
// ======================================================

function SuccessCard({
  refNumber,
  data,
  onReset,
}) {
  return (
    <div className="glass p-8 sm:p-14 text-center reveal in-view">

      <div className="w-16 h-16 mx-auto rounded-full bg-[#00A3AD] flex items-center justify-center mb-6">

        <Check
          className="text-[#121416]"
          size={30}
        />

      </div>

      <h3 className="font-display text-2xl sm:text-3xl tracking-tight mb-3">
        APPLICATION RECEIVED
      </h3>

      <p className="text-[#F4F4F4]/70 max-w-md mx-auto mb-6">

        Thank you,{' '}
        {data.fullName ||
          'applicant'}
        . Your application has been
        successfully submitted to Mhlanga
        Senior Secondary School.

        <br />

        <span className="inline-block mt-2">
          A confirmation email has been sent
          to{' '}
          <strong className="text-[#F4F4F4]">
            {data.email}
          </strong>
          .
        </span>

      </p>

      <div className="inline-block border border-[#D27D2D]/50 px-6 py-3 mb-8">

        <span className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 block">
          Application Reference
        </span>

        <span className="font-display text-xl cyan-acc">
          {refNumber}
        </span>

      </div>

      <p className="text-xs text-[#F4F4F4]/45 max-w-md mx-auto mb-8">
        Please keep your application reference
        number safe. You may need it when
        communicating with the school about
        your application.
      </p>

      <div>

        <button
          type="button"
          onClick={onReset}
          className="text-sm text-[#00A3AD] hover:text-[#F4F4F4] transition-colors"
        >
          Submit another application →
        </button>

      </div>

    </div>
  );
}