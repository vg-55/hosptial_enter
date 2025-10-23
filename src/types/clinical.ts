export interface ClinicalNote {
  id: string;
  patientId: string;
  patientName: string;
  authorId: string;
  authorName: string;
  date: string;
  type: 'progress' | 'admission' | 'discharge' | 'consultation' | 'procedure' | 'general';
  category: string;
  title: string;
  content: string;
  templateId?: string;
  status: 'draft' | 'final' | 'amended';
  lastModified: string;
  department: string;
  tags: string[];
}

export interface ClinicalDocument {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  type: 'lab_result' | 'radiology' | 'pathology' | 'prescription' | 'consent_form' | 'other';
  category: string;
  uploadDate: string;
  uploadedBy: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  tags: string[];
  department: string;
}

export interface NoteTemplate {
  id: string;
  name: string;
  type: ClinicalNote['type'];
  category: string;
  content: string;
  fields: TemplateField[];
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface ClinicalStats {
  totalNotes: number;
  notesChange: number;
  totalDocuments: number;
  documentsChange: number;
  pendingReviews: number;
  reviewsChange: number;
  averageCompletionTime: number;
  timeChange: number;
}
