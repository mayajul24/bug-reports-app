import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../api/client';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024;

const schema = z.object({
  issueType: z.string().min(1, 'Please select an issue type'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  contactEmail: z.email('Please enter a valid email address'),
  attachment: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_SIZE,
      'File must be 5MB or less'
    )
    .refine(
      (files) => !files || files.length === 0 || ALLOWED_TYPES.includes(files[0].type),
      'Only PNG, JPG, and PDF files are allowed'
    ),
});

type FormData = z.infer<typeof schema>;

export function ReportPage() {
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      const file = data.attachment?.[0];
      await apiClient.createReport(
        { issueType: data.issueType, description: data.description, contactName: data.contactName, contactEmail: data.contactEmail },
        file
      );
      setSubmitSuccess(true);
      reset();
    } catch {
      setSubmitError('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="page">
      <h1>Report a Bug</h1>

      <p className="form-required-note"><span className="required-star">*</span> Required fields</p>

      {submitSuccess && (
        <div className="alert alert-success">Report submitted successfully!</div>
      )}
      {submitError && (
        <div className="alert alert-error">{submitError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label htmlFor="issueType">Issue Type <span className="required-star">*</span></label>
          <select
            id="issueType"
            className={errors.issueType ? 'input-error' : ''}
            {...register('issueType')}
          >
            <option value="">Select issue type</option>
            <option value="Bug">Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Improvement">Improvement</option>
            <option value="Documentation">Documentation</option>
            <option value="Other">Other</option>
          </select>
          {errors.issueType && <span className="field-error">{errors.issueType.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description <span className="required-star">*</span></label>
          <textarea
            id="description"
            placeholder="Describe the issue..."
            rows={5}
            className={errors.description ? 'input-error' : ''}
            {...register('description')}
          />
          {errors.description && <span className="field-error">{errors.description.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contactName">Your Name <span className="required-star">*</span></label>
          <input
            type="text"
            id="contactName"
            placeholder="Enter your name"
            className={errors.contactName ? 'input-error' : ''}
            {...register('contactName')}
          />
          {errors.contactName && <span className="field-error">{errors.contactName.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contactEmail">Your Email <span className="required-star">*</span></label>
          <input
            type="email"
            id="contactEmail"
            placeholder="you@example.com"
            className={errors.contactEmail ? 'input-error' : ''}
            {...register('contactEmail')}
          />
          {errors.contactEmail && <span className="field-error">{errors.contactEmail.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="attachment">Attachment (optional)</label>
          <input
            type="file"
            id="attachment"
            accept=".png,.jpg,.jpeg,.pdf"
            className={errors.attachment ? 'input-error' : ''}
            {...register('attachment')}
          />
          <small className="form-hint">Accepted formats: PNG, JPG, PDF — max 5MB</small>
          {errors.attachment && <span className="field-error">{errors.attachment.message as string}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}