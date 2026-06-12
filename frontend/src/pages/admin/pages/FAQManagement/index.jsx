import { useCallback, useEffect, useState } from 'react'
import { FileText, Pencil, Trash2, Loader, AlertTriangle, ChevronLeft, ChevronRight, Plus, Tag, Save, X } from 'lucide-react'
import Modal from '../../../../components/Modal/Modal'
import Button from '../../../../components/Button/Button'
import { notifyError, notifySuccess } from '../../../../lib/notify'
import { fetchFAQs, updateFAQ, deleteFAQ, createFAQ, fetchTags, createTag, renameTag, deleteTag } from '../../service'
import { parseMarkdown } from '../../../../lib/markdown'
import DOMPurify from 'dompurify'
import { queryClient } from '../../../../lib/queryClient'

const EMPTY_FORM = { title: '', body: '', tags: '' }
const PAGE_SIZE = 10
const EMPTY_TAG_FORM = { name: '', description: '' }

// Shared field styling (Stitch "Add FAQ" redesign), mapped to our theme tokens.
const LABEL_CLS = 'mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted transition-colors group-focus-within:text-text-primary'
const INPUT_CLS = 'w-full rounded-lg border border-border bg-bg-primary px-4 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted outline-none transition focus:border-text-primary focus:ring-1 focus:ring-text-primary'

// Convert HTML tags to Markdown for editing
function htmlToMarkdown(html = '') {
  if (!html) return ''
  let text = html
  // Replace list items
  text = text.replace(/<li>\s*(.*?)\s*<\/li>/gi, '* $1\n')
  // Replace headers
  text = text.replace(/<h1>\s*(.*?)\s*<\/h1>/gi, '# $1\n\n')
  text = text.replace(/<h2>\s*(.*?)\s*<\/h2>/gi, '## $1\n\n')
  text = text.replace(/<h3>\s*(.*?)\s*<\/h3>/gi, '### $1\n\n')
  // Replace bold/italic/code
  text = text.replace(/<strong[^>]*>\s*(.*?)\s*<\/strong>/gi, '**$1**')
  text = text.replace(/<b[^>]*>\s*(.*?)\s*<\/b>/gi, '**$1**')
  text = text.replace(/<em[^>]*>\s*(.*?)\s*<\/em>/gi, '*$1*')
  text = text.replace(/<i[^>]*>\s*(.*?)\s*<\/i>/gi, '*$1*')
  text = text.replace(/<code[^>]*>\s*(.*?)\s*<\/code>/gi, '`$1`')
  // Replace paragraphs and line breaks
  text = text.replace(/<p[^>]*>/gi, '')
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<br\s*\/?>/gi, '\n')
  // Strip any other tags
  text = text.replace(/<[^>]*>/g, '')
  // Clean up entities
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  return text.trim()
}

// Sanitize HTML using DOMPurify
function sanitizeHtml(html = '') {
  return DOMPurify.sanitize(html)
}

// Sectioned create/edit FAQ modal — header (serif title + subtitle), grouped
// fields with focus-aware labels, leading tag icon, and a ghost/black footer.
function FaqFormModal({ open, onClose, title, subtitle, form, setForm, onSubmit, busy, submitLabel }) {
  const [tab, setTab] = useState('write') // 'write' | 'preview'

  // Reset tab to write when opening/closing
  useEffect(() => {
    if (!open) {
      setTab('write')
    }
  }, [open])

  return (
    <Modal isOpen={open} onClose={onClose} title={title} panelClassName="!max-w-xl !rounded-xl !p-0 overflow-hidden">
      <form onSubmit={onSubmit}>
        <div className="border-b border-border-light px-8 pb-6 pt-8">
          <h2 className="font-display text-[26px] font-bold leading-tight text-text-primary">{title}</h2>
          <p className="mt-1 text-[13px] text-text-secondary">{subtitle}</p>
        </div>

        <div className="space-y-5 px-8 py-7">
          <div className="group">
            <label className={LABEL_CLS}>QUESTION</label>
            <input
              className={INPUT_CLS}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g., How do I submit my weekly report?"
            />
          </div>
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted transition-colors group-focus-within:text-text-primary">
                ANSWER
              </label>
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted transition-colors group-focus-within:text-text-primary">
                Markdown
              </div>
            </div>
            <div
              className="w-full rounded-lg border border-border bg-bg-primary px-4 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted outline-none transition focus:border-text-primary focus:ring-1 focus:ring-text-primary"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(parseMarkdown(form.body)) }}
            />
            <textarea
              className="w-full rounded-lg border border-border bg-bg-primary px-4 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted outline-none transition focus:border-text-primary focus:ring-1 focus:ring-text-primary"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="e.g., You can submit your weekly report by clicking on the 'Submit Report' button."
            />
          </div>
        </div>

        <div className="border-t border-border-light px-8 py-7">
          <Button type="submit" className="w-full" loading={busy} disabled={busy}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default FaqFormModal