import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field, Label, Textarea, Switch } from '@headlessui/react'
import { CheckCircle2, Lightbulb, EyeOff, Image as ImageIcon, ExternalLink, Sparkles, Send } from 'lucide-react'
import Button from '../../../../components/Button/Button'
import Input from '../../../../components/Input/Input'
import Select from '../../../../components/Select/Select'
import { createQuestion, fetchQuestionTags } from '../../service'
import { queryClient } from '../../../../lib/queryClient'
import { notifyError } from '../../../../lib/notify'

const STATUS_BADGE = {
  Resolved:      'bg-[#dcfce7] text-[#166534]',
  'In Progress': 'bg-[#ffedd5] text-[#9a3412]',
  Active:        'bg-[#8c6a40]/10 text-[#8c6a40]',
}

function stripHtml(s = '') {
  return s.replace(/<[^>]*>/g, '').trim()
}

function RaiseQueryPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([]) // { value, label }
  const [category, setCategory]     = useState('')
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [anonymous, setAnonymous]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  // Similar queries come from the cached dashboard questions (empty until the
  // dashboard has been visited; cleared + refetched when Dashboard is reopened).
  const cachedQuestions = queryClient.getQueryData(['dashboardQuestions']) || []
  const pool = category
    ? cachedQuestions.filter(q => q.tags?.some(t => t.label.toLowerCase() === category.toLowerCase()))
    : cachedQuestions
  const similar = (pool.length ? pool : cachedQuestions).slice(0, 3)

  // Category options come from the DB tags so the query lands in the right bucket
  useEffect(() => {
    fetchQuestionTags()
      .then(tags =>
        setCategories(
          (tags || []).map(t => ({
            value: t.tag,
            label: t.tag.charAt(0).toUpperCase() + t.tag.slice(1),
          })),
        ),
      )
      .catch(() => setCategories([]))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!category)                return notifyError('Please choose a category.')
    if (title.trim().length < 10) return notifyError('Title must be at least 10 characters.')
    if (!description.trim())      return notifyError('Please add a description.')

    setSubmitting(true)
    try {
      await createQuestion({ title: title.trim(), body: description.trim(), tags: [category], isAnonymous: anonymous })
      setSubmitted(true)
      setTimeout(() => navigate('/dashboard'), 2500)
    } catch (err) {
      notifyError(err.response?.data?.message || 'Could not submit your query.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success state ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-1 items-center justify-center px-8 py-16">
        <div className="flex max-w-md flex-col items-center rounded-2xl border border-[#e5e7eb] bg-white p-12 text-center shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
            <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <h2 className="font-display mb-2 text-[22px] font-bold text-[#191c1d]">Thank you!</h2>
          <p className="text-[13px] leading-6 text-[#444748]">
            We have noted your concern and will look into it.
          </p>
          <p className="mt-3 text-[12px] text-[#9ca3af]">Redirecting to your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-8 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* ── Form card ─────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-sm">
          <Field className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#374151]">Query Category</Label>
            <Select
              options={categories}
              value={category}
              onChange={setCategory}
              placeholder="Select category…"
            />
          </Field>

          <Field className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#374151]">Query Title</Label>
            <Input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Briefly state your concern (e.g., Delay in Grade Upload)"
            />
          </Field>

          <Field className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#374151]">Detailed Description</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              placeholder="Provide as much detail as possible to help us resolve this quickly…"
              className="w-full resize-y rounded-lg border border-[#d1d5db] bg-white px-4 py-3 text-[13px] text-[#191c1d] shadow-sm outline-none transition placeholder:text-[#9da1a1] focus:border-black focus:ring-1 focus:ring-black"
            />
          </Field>

          {/* Attachments (not supported yet) */}
          <Field className="flex flex-col">
            <Label className="mb-2 text-[13px] font-semibold text-[#374151]">Attachments (Optional)</Label>
            <button
              type="button"
              onClick={() => notifyError('Attachments are not supported yet.')}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d1d5db] bg-white px-4 py-10 text-center transition hover:border-[#8c6a40] hover:bg-[#8c6a40]/5"
            >
              <ImageIcon className="h-7 w-7 text-[#9ca3af]" strokeWidth={1.6} />
              <span className="text-[13px] font-bold text-[#191c1d]">Click or drag and drop files here</span>
              <span className="text-[12px] text-[#9ca3af]">PDF, JPG, PNG (Max 5MB)</span>
            </button>
          </Field>

          {/* Raise anonymously */}
          <div className="flex items-center justify-between rounded-xl bg-[#eef2f7] px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-[#8c6a40]" strokeWidth={1.8} />
                <span className="text-[14px] font-bold text-[#191c1d]">Raise Anonymously</span>
              </div>
              <p className="mt-1 text-[12px] text-[#6b7280]">
                Admins won't see your profile details, but resolution may take longer.
              </p>
            </div>
            <Switch
              checked={anonymous}
              onChange={setAnonymous}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${
                anonymous ? 'bg-[#8c6a40]' : 'bg-[#cbd5e1]'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${
                  anonymous ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </Switch>
          </div>

          {/* Footer actions */}
          <div className="mt-1 flex items-center justify-end gap-5">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-[14px] font-semibold text-[#6b7280] transition hover:text-[#191c1d]"
            >
              Discard Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-[#0b1528] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" strokeWidth={1.8} />
              {submitting ? 'Submitting…' : 'Submit Query'}
            </button>
          </div>
        </form>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Similar Queries */}
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 font-display text-[20px] font-bold text-[#191c1d]">
              <Sparkles className="h-5 w-5 text-[#8c6a40]" strokeWidth={1.8} /> Similar Queries
            </h3>
            <p className="mb-5 text-[13px] leading-6 text-[#6b7280]">
              We found some queries similar to yours. Checking these might give you an instant answer.
            </p>

            {similar.length === 0 ? (
              <p className="text-[12px] text-[#9ca3af]">No similar queries yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {similar.map(q => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => navigate(`/query/${q.id}`)}
                    className="rounded-xl border border-[#e5e7eb] p-4 text-left transition hover:border-[#8c6a40] hover:shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${STATUS_BADGE[q.status] || STATUS_BADGE.Active}`}>
                        {q.status}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-[#9ca3af]" strokeWidth={1.8} />
                    </div>
                    <h4 className="mb-1 text-[14px] font-bold text-[#191c1d]">{q.title}</h4>
                    <p className="line-clamp-2 text-[12px] leading-5 text-[#6b7280]">
                      "{stripHtml(q.desc)}"
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pro Tip — dark card */}
          <div className="rounded-2xl bg-[#0b1528] p-6 text-white">
            <h3 className="mb-3 flex items-center gap-2 font-display text-[16px] font-bold">
              <Lightbulb className="h-4 w-4 text-[#f5c451]" strokeWidth={1.8} /> Pro Tip
            </h3>
            <p className="text-[13px] leading-6 text-[#c4c7c7]">
              Adding screenshots or PDF receipts usually speeds up the resolution process by up to 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RaiseQueryPage
