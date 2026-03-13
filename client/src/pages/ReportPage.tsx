import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../api/client';

const schema = z.object({
  issueType: z.string().min(1, 'Please select an issue type'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  contactEmail: z.email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export function ReportPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await apiClient.createReport(data);
  };

  return (
    <div className="page">
      <h1>Report a Bug</h1>

      <p className="form-required-note"><span className="required-star">*</span> Required fields</p>

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
            disabled
            title="TODO: Implement file upload"
          />
          <small className="form-hint">
            TODO: Implement attachment upload (PNG, JPG, PDF, max 5MB)
          </small>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}