'use client'

import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const defaultContent = `# Welcome to Your Markdown Notebook

This is a simple markdown notebook for ideation and note-taking.

## Features

- **Toggle between Read and Edit modes** - Click the button above to switch
- **Markdown support** - Use standard markdown syntax
- **Auto-save** - Your notes are automatically saved to browser storage
- **Simple text editing** - Clean, distraction-free editing experience

## Getting Started

Click the "Edit" button above to start writing your notes. Here are some markdown examples:

### Text Formatting

You can make text **bold**, *italic*, or ***both***.

### Lists

Unordered list:
- Item 1
- Item 2
- Item 3

Ordered list:
1. First item
2. Second item
3. Third item

### Code

Inline code: \`const hello = "world"\`

Code block:
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Links and Images

[Link to Google](https://google.com)

### Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

### Tables

| Feature | Status |
|---------|--------|
| Read Mode | ✓ |
| Edit Mode | ✓ |
| Auto-save | ✓ |

---

**Happy note-taking!**
`

export default function MarkdownNotebook() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [content, setContent] = useState(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showCopied, setShowCopied] = useState(false)

  // Load content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('markdown-notebook-content')
    if (savedContent) {
      setContent(savedContent)
    }
    setIsLoading(false)
  }, [])

  // Save content to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('markdown-notebook-content', content)
      setLastSaved(new Date())
    }
  }, [content, isLoading])

  const handleToggleMode = () => {
    setIsEditMode(!isEditMode)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  // Export as markdown file
  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `notebook-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Copy to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+E or Ctrl+E to toggle edit mode
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        setIsEditMode((prev) => !prev)
      }
      // Escape to switch to read mode
      if (e.key === 'Escape' && isEditMode) {
        setIsEditMode(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditMode])

  // Word and character count
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const charCount = content.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading notebook...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header - YC Style with Actions */}
      <div className="mb-6 space-y-4 border-b-2 border-[#ff6600] pb-4">
        {/* Top row: Mode indicator and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-mono text-sm text-gray-600">
              {isEditMode ? (
                <span>⌨️ editing mode</span>
              ) : (
                <span>📖 reading mode</span>
              )}
            </div>
            {lastSaved && (
              <div className="font-mono text-xs text-gray-400">
                💾 saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="relative border-2 border-gray-400 bg-white px-3 py-2 font-mono text-xs font-semibold text-gray-600 transition-all hover:border-[#ff6600] hover:text-[#ff6600]"
              title="Copy to clipboard"
            >
              {showCopied ? '✓ copied!' : '📋 copy'}
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="border-2 border-gray-400 bg-white px-3 py-2 font-mono text-xs font-semibold text-gray-600 transition-all hover:border-[#ff6600] hover:text-[#ff6600]"
              title="Download as .md file"
            >
              ⬇ export
            </button>

            {/* Toggle Button */}
            <button
              onClick={handleToggleMode}
              className="border-2 border-[#ff6600] bg-white px-5 py-2 font-mono text-sm font-semibold text-[#ff6600] transition-all hover:bg-[#ff6600] hover:text-white"
              title="Toggle edit/read mode (⌘E)"
            >
              {isEditMode ? 'read' : 'edit'}
            </button>
          </div>
        </div>

        {/* Bottom row: Stats */}
        <div className="flex items-center gap-6 font-mono text-xs text-gray-500">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          <span className="text-gray-400">⌘E to toggle • ESC to read</span>
        </div>
      </div>

      {/* Notebook Content - YC Style with Smooth Transitions */}
      <div className="border-2 border-gray-300 bg-white p-6 shadow-sm transition-all duration-300">
        {isEditMode ? (
          /* Edit Mode - Simple Textarea */
          <div className="animate-in fade-in duration-300">
            <div className="mb-3 font-mono text-xs text-gray-500">
              💾 auto-saves to browser storage
            </div>
            <textarea
              value={content}
              onChange={handleContentChange}
              className="min-h-[600px] w-full resize-y border-2 border-gray-200 bg-[#fafafa] p-4 font-mono text-sm text-gray-800 transition-all focus:border-[#ff6600] focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20"
              placeholder="# Start writing your markdown here..."
            />
          </div>
        ) : (
          /* Read Mode - Rendered Markdown */
          <div className="prose prose-slate max-w-none animate-in fade-in font-mono duration-300 prose-headings:text-[#ff6600] prose-headings:font-bold prose-a:text-[#ff6600] prose-a:no-underline hover:prose-a:underline prose-code:bg-[#f6f6ef] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#ff6600] prose-pre:bg-[#f6f6ef] prose-pre:border-2 prose-pre:border-gray-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Quick Tips - YC Style */}
      {isEditMode && (
        <div className="mt-6 border-l-4 border-[#ff6600] bg-[#fffaf0] p-4">
          <h3 className="mb-2 font-mono text-sm font-bold text-[#ff6600]">
            ~/markdown-cheatsheet
          </h3>
          <ul className="space-y-1 font-mono text-xs text-gray-700">
            <li>→ <code className="bg-white px-1"># Heading</code> for headers</li>
            <li>→ <code className="bg-white px-1">**bold**</code> for bold text</li>
            <li>→ <code className="bg-white px-1">*italic*</code> for italic text</li>
            <li>→ <code className="bg-white px-1">- item</code> for lists</li>
            <li>→ <code className="bg-white px-1">`code`</code> for inline code</li>
          </ul>
        </div>
      )}
    </div>
  )
}
