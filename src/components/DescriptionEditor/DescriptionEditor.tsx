import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Color from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import "./DescriptionEditor.scss"

interface DescriptionEditorProps {
  title: string
  content: string
  onTitleChange: (title: string) => void
  onContentChange: (html: string) => void
  onRemove: () => void
}

export const DescriptionEditor = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onRemove,
}: DescriptionEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
    ],
    content: content,
    onUpdate: ({ editor }) => onContentChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose prose-invert max-w-none" },
    },
  })

  const handleColorChange = (color: string) => {
    if (color === "") {
      // Если цвет пустой — убираем форматирование
      editor?.chain().focus().unsetColor().run()
    } else {
      editor?.chain().focus().setColor(color).run()
    }
  }

  return (
    <div className="description-editor">
      <div className="description-header">
        <input
          type="text"
          placeholder="Название описания..."
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          className="description-title-input"
        />
        <button type="button" onClick={onRemove} className="btn-remove">
          ✕
        </button>
      </div>

      <div className="tiptap-toolbar">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "is-active" : ""}
          title="Жирный"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "is-active" : ""}
          title="Курсив"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Маркированный список"
        >
          • Список
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title="Нумерованный список"
        >
          1. Нумерованный
        </button>
        <button
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Заголовок H2"
        >
          H2
        </button>

        {/* 🔹 Кнопка выбора цвета текста */}
        <div className="toolbar-color-picker">
          <label className="color-picker-label" title="Цвет текста">
            <span className="color-picker-icon">Выбор цвета</span>
            <input
              type="color"
              value={editor?.getAttributes("textStyle").color || "#ffffff"}
              onChange={e => handleColorChange(e.target.value)}
              className="color-picker-input"
            />
          </label>
          <button
            type="button"
            onClick={() => handleColorChange("")}
            className="btn-clear-color"
            title="Сбросить цвет"
          >
            ×
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
