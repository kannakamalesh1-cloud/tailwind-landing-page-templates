import { Metadata } from 'next'
import MarkdownNotebook from '@/components/markdown-notebook'

export const metadata: Metadata = {
  title: 'Markdown Notebook - IdeationTailwind',
  description: 'A simple markdown notebook for ideation and note-taking',
}

export default function NotebookPage() {
  return (
    <section className="relative bg-[#f6f6ef]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Page header - YC style */}
          <div className="pb-8 md:pb-12">
            <div className="mb-8 border-l-4 border-[#ff6600] pl-6">
              <h1 className="mb-2 font-mono text-4xl font-bold text-[#ff6600] md:text-5xl">
                notebook.md
              </h1>
              <p className="font-mono text-base text-gray-600">
                // A simple markdown notebook for ideation
              </p>
            </div>
          </div>

          {/* Notebook Component */}
          <MarkdownNotebook />
        </div>
      </div>
    </section>
  )
}
