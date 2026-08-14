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
 * {{grade_applying}}
 */
export async function sendApplicationReceivedEmail({
  toEmail,
  toName,
  ref,
  gradeApplying,
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
    console.log('Grade:', gradeApplying);

    const response = await emailjs.send(
      SERVICE_ID,
      AUTO_REPLY_TEMPLATE_ID,
      {
        to_email: toEmail,
        to_name: toName,
        ref_number: ref,
        grade_applying: gradeApplying,
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
 * {{status}}
 * {{admission_number}}
 */
export async function sendStatusUpdateEmail({
  toEmail,
  toName,
  ref,
  status,
  admissionNumber,
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
    console.log('Status:', status);
    console.log(
      'Admission Number:',
      admissionNumber || 'N/A'
    );

    const response = await emailjs.send(
      SERVICE_ID,
      STATUS_TEMPLATE_ID,
      {
        to_email: toEmail,
        to_name: toName,
        ref_number: ref,
        status,
        admission_number:
          admissionNumber || 'N/A',
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