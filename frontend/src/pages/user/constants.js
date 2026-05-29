import { Tag } from 'lucide-react'

export const STATUS_CONFIG = {
  Active:        { color: '#8c6a40' },
  'In Progress': { color: '#4b5563' },
  Closed:        { color: '#16a34a' },
}

// Deterministic colour palette for dynamically-loaded tags.
const TAG_PALETTE = [
  { color: '#8c6a40', bg: '#f5efe6' },
  { color: '#9a3412', bg: '#ffedd5' },
  { color: '#7e22ce', bg: '#f3e8ff' },
  { color: '#be123c', bg: '#ffe4e6' },
  { color: '#1d4ed8', bg: '#eff6ff' },
  { color: '#374151', bg: '#f3f4f6' },
  { color: '#b45309', bg: '#fef3c7' },
  { color: '#15803d', bg: '#dcfce7' },
]

export function styleForTag(tag) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0
  return { Icon: Tag, ...TAG_PALETTE[hash % TAG_PALETTE.length] }
}

export const CONTRIBUTION_ITEMS = [
  { color: '#16a34a', title: 'Resolved: Hostel Wi-Fi downtime',   time: 'RESOLVED 10 MINS AGO' },
  { color: '#3b82f6', title: 'Commented: CMS102 Grade Upload',   time: '2 HOURS AGO'          },
  { color: '#3b82f6', title: 'Commented: Portal Elective Reg…',  time: 'YESTERDAY'            },
]
