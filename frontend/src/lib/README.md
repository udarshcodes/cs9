# lib/

Utility helpers shared across the frontend.

## notify.js

Wrappers around `react-toastify` for inline feedback.

```js
import { notifyError, notifySuccess } from '../../lib/notify'

notifySuccess('Changes saved!')
notifyError("Report doesn't supported yet.")
```

- `notifySuccess(message)` — green toast, top-right, 3s auto-close
- `notifyError(message)` — red toast, top-right, 4s auto-close

## queryClient.js

TanStack Query client instance. Configures caching defaults for the landing page FAQ cache.

```js
import { queryClient } from './lib/queryClient'

// Invalidate landing FAQs after admin publishes new FAQ
queryClient.invalidateQueries({ queryKey: ['landing-faqs'] })
```

Currently scoped to the landing page only — `staleTime: Infinity` makes FAQs static until explicit invalidation.
