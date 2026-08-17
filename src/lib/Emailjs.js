import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const AUTO_REPLY_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
const STATUS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_STATUS_TEMPLATE_ID;

let initialized = false;

function ensureInit() {
  if (!PUBLIC_KEY) {
    throw new Error(
      'Missing VITE_EMAILJS_PUBLIC_KEY in .env'
    );
  }

  if (!initialized) {
    emailjs.init({
      publicKey: PUBLIC_KEY,
    });

    initialized = true;
  }
}

/**
 * Sends an email to the applicant immediately
 * after their application has been submitted.
 *
 * EmailJS template variables:
 *
 * {{to_email}}
 * {{to_name}}
 * {{ref_number}}
 * {{intake_year}}
 * {{grade_applying}}
 * {{stream}}
 */
export async function sendApplicationReceivedEmail({
  toEmail,
  toName,
  ref,
  intakeYear,
  gradeApplying,
  stream,
}) {
  try {
    ensureInit();

    if (!SERVICE_ID) {
      throw new Error(
        'Missing VITE_EMAILJS_SERVICE_ID in .env'
      );
    }

    if (!AUTO_REPLY_TEMPLATE_ID) {
      throw new Error(
        'Missing VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID in .env'
      );
    }

    if (!toEmail) {
      throw new Error(
        'Applicant email address is missing'
      );
    }

    console.log('Sending application confirmation email...');
    console.log('Email:', toEmail);
    console.log('Name:', toName);
    console.log('Reference:', ref);
    console.log('Intake Year:', intakeYear || 'N/A');
    console.log('Grade:', gradeApplying);
    console.log('Stream:', stream || 'N/A');

    const response = await emailjs.send(
      SERVICE_ID,
      AUTO_REPLY_TEMPLATE_ID,
      {
        to_email: toEmail,
        to_name: toName,
        ref_number: ref,
        intake_year: intakeYear || 'N/A',
        grade_applying: gradeApplying,
        stream: stream || 'N/A',
      }
    );

    console.log(
      'Application confirmation email sent successfully:',
      response
    );

    return {
      ok: true,
      response,
    };
  } catch (err) {
    console.error(
      'EmailJS application confirmation failed:',
      err
    );

    return {
      ok: false,
      error: err,
    };
  }
}

/**
 * Sends an email whenever the admin changes
 * the application's status.
 *
 * EmailJS template variables:
 *
 * {{to_email}}
 * {{to_name}}
 * {{ref_number}}
 * {{intake_year}}
 * {{status}}
 * {{admission_number}}
 * {{grade_applying}}
 * {{stream}}
 */
export async function sendStatusUpdateEmail({
  toEmail,
  toName,
  ref,
  intakeYear,
  status,
  admissionNumber,
  gradeApplying,
  stream,
}) {
  try {
    ensureInit();

    if (!SERVICE_ID) {
      throw new Error(
        'Missing VITE_EMAILJS_SERVICE_ID in .env'
      );
    }

    if (!STATUS_TEMPLATE_ID) {
      throw new Error(
        'Missing VITE_EMAILJS_STATUS_TEMPLATE_ID in .env'
      );
    }

    if (!toEmail) {
      throw new Error(
        'Applicant email address is missing'
      );
    }

    console.log('Sending application status email...');
    console.log('Email:', toEmail);
    console.log('Name:', toName);
    console.log('Reference:', ref);
    console.log('Intake Year:', intakeYear || 'N/A');
    console.log('Status:', status);
    console.log(
      'Admission Number:',
      admissionNumber || 'N/A'
    );
    console.log('Grade:', gradeApplying || 'N/A');
    console.log('Stream:', stream || 'N/A');

    const response = await emailjs.send(
      SERVICE_ID,
      STATUS_TEMPLATE_ID,
      {
        to_email: toEmail,
        to_name: toName,
        ref_number: ref,
        intake_year: intakeYear || 'N/A',
        status,
        admission_number:
          admissionNumber || 'N/A',
        grade_applying: gradeApplying || 'N/A',
        stream: stream || 'N/A',
      }
    );

    console.log(
      'Application status email sent successfully:',
      response
    );

    return {
      ok: true,
      response,
    };
  } catch (err) {
    console.error(
      'EmailJS status update failed:',
      err
    );

    return {
      ok: false,
      error: err,
    };
  }
}