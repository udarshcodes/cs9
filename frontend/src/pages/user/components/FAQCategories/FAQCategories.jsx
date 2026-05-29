import { TrendingUp, X } from 'lucide-react'

/**
 * Top FAQ categories widget — shows the top 5 tags (from the DB)
 * as a numbered list. Multi-select: clicking toggles a tag in the filter.
 */
function FAQCategories({ categories = [], selected = [], onToggle, onClear }) {
  const top = categories.slice(0, 5)

  return (
    <div className="rounded-xl border border-[#c4c7c7] bg-white p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-md bg-[#8c6a40] p-1.5 text-white">
          <TrendingUp className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <span className="font-display text-[16px] font-semibold text-[#191c1d]">Top FAQ Categories</span>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear selected categories"
            className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8c6a40]/10 text-[#8c6a40] transition hover:bg-[#8c6a40] hover:text-white"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {top.length === 0 ? (
        <p className="text-[12px] text-[#9ca3af]">No categories yet.</p>
      ) : (
        <ul className="space-y-2">
          {top.map(({ tag, count }, i) => {
            const isSelected = selected.includes(tag)
            return (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => onToggle?.(tag)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition ${
                    isSelected ? 'bg-[#8c6a40]/10' : 'hover:bg-[#f3f4f6]'
                  }`}
                >
                  <span className={`font-display text-[20px] leading-none ${isSelected ? 'text-[#8c6a40]' : 'text-[#9ca3af]'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h5 className={`flex-1 text-[13px] font-medium capitalize ${isSelected ? 'text-[#8c6a40]' : 'text-[#191c1d]'}`}>
                    {tag}
                  </h5>
                  <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-[#747878]">
                    {count} {count === 1 ? 'query' : 'queries'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default FAQCategories
