import { axiosPublic, axisPrivate } from '../../api/axios'

const iconByTag = {
	certificate: 'award',
	certificates: 'award',
	communication: 'message-circle',
	coursework: 'file-text',
	exemption: 'file-text',
	exemptions: 'file-text',
	interview: 'messages-square',
	internship: 'briefcase-business',
	login: 'laptop',
	noc: 'shield-check',
	onboarding: 'shield-check',
	platform: 'laptop',
	rosetta: 'newspaper',
	selection: 'clipboard-check',
	team: 'users',
	timeline: 'calendar-clock',
	vibe: 'terminal',
	vins: 'info',
}

function slugify(value) {
	return (
		String(value)
			.trim()
			.toLowerCase()
			.replace(/&/g, 'and')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'general'
	)
}

function getTagIcon(label) {
	const normalizedLabel = slugify(label)
	const matchingKey = Object.keys(iconByTag).find((key) => normalizedLabel.includes(key))

	return matchingKey ? iconByTag[matchingKey] : 'tag'
}

function normalizeFaq(faq) {
	return {
		id: String(faq.id || faq.question_id || faq._id || crypto.randomUUID()),
		question: faq.question || faq.title || 'Untitled question',
		answer: faq.answer || faq.body || faq.body_plain || '',
		category: faq.category || '',
		tags: Array.isArray(faq.tags) ? faq.tags : [],
		updatedAt: faq.updatedAt || faq.updated_at || null,
	}
}

function normalizeSections(payload) {
	if (Array.isArray(payload.tags)) {
		return payload.tags
			.map((tag) => {
				const label = String(tag.label || tag.name || tag.tag || 'General').trim() || 'General'

				return {
					id: tag.id || slugify(label),
					icon: getTagIcon(label),
					label,
					faqs: Array.isArray(tag.faqs) ? tag.faqs.map(normalizeFaq) : [],
				}
			})
			.filter((section) => section.faqs.length > 0)
	}

	if (payload.faqs && typeof payload.faqs === 'object') {
		return Object.entries(payload.faqs)
			.map(([label, faqs]) => ({
				id: slugify(label),
				icon: getTagIcon(label),
				label,
				faqs: Array.isArray(faqs) ? faqs.map(normalizeFaq) : [],
			}))
			.filter((section) => section.faqs.length > 0)
	}

	return []
}

export async function getFaqSections(signal) {
	const response = await axiosPublic().get('/api/faqs', { signal })
	return normalizeSections(response.data)
}

export async function getCurrentUser(signal) {
	const { data } = await axisPrivate().get('/api/auth/me', { signal })
	return data.user
}
