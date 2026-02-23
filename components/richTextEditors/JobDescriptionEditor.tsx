"use client";
import { useEditor, EditorContent } from "@tiptap/react";
//import { FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Menubar } from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";

export function JobDescriptionEditor() {
  const editor = useEditor({
    extensions: [StarterKit, TextAlign, Typography],
    immediatelyRender: false,
  });

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-card">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
