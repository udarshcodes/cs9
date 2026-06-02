/* global __PROJECT_NAME__, __PROJECT_OWNER__ */
import { Home, Mail, MapPin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[32px] border border-border bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.04)]">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Quick Links
            </p>
            <ul className="space-y-3 text-[14px] text-slate-600">
              <li>
                <a href="#" className="inline-flex items-center gap-2 transition hover:text-slate-950">
                  <Home className="h-4 w-4" strokeWidth={2} />
                  Home
                </a>
              </li>
              <li>
                <a href="https://www.iitrpr.ac.in/" target="_blank" rel="noreferrer" className="transition hover:text-slate-950">
                  IIT Ropar
                </a>
              </li>
              <li>
                <a href="https://vled.iitrpr.ac.in/" target="_blank" rel="noreferrer" className="transition hover:text-slate-950">
                  VLED Lab
                </a>
              </li>
              <li>
                <a href="https://samagama.in/" target="_blank" rel="noreferrer" className="transition hover:text-slate-950">
                  Samagama
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Affiliations
            </p>
            <p className="max-w-xs text-[14px] leading-7 text-slate-600">
              Developed under the guidance of the Vicharanashala Lab for Education Design (VLED), an educational
              innovation initiative at Indian Institute of Technology Ropar.
            </p>
          </div>

          <div>
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Contact Us
            </p>
            <div className="mb-4 inline-flex items-center gap-3 text-[14px] text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" strokeWidth={2} />
              <a href="mailto:vled@iitrpr.ac.in" className="transition hover:text-slate-950 lowercase">
                vled@iitrpr.ac.in
              </a>
            </div>
            <div className="inline-flex items-start gap-3 text-[14px] leading-7 text-slate-600">
              <MapPin className="mt-1 h-4 w-4 text-slate-400" strokeWidth={2} />
              <address className="not-italic">
                Indian Institute of Technology Ropar<br />
                Rupnagar, Punjab – 140001<br />
                India
              </address>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <p>
            &copy; {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <p>
            Powered by Vicharanashala Lab for Education Design (VLED), Indian Institute of Technology Ropar.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
