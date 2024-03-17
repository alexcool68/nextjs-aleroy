'use client';

import React, { useCallback } from 'react';

import { EditorContent, useEditor } from '@tiptap/react';
import { type Editor } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';

import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Paragraph from '@tiptap/extension-paragraph';
import Underline from '@tiptap/extension-underline';
import Blockquote from '@tiptap/extension-blockquote';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';

import { BoldIcon, Code2, Heading1Icon, ItalicIcon, Link2Off, LinkIcon, ListIcon, ListOrderedIcon, QuoteIcon, UnderlineIcon } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

interface ToolbarProps {
    editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
    if (!editor) {
        return null;
    }

    // const setLink = useCallback(() => {
    //     const previousUrl = editor.getAttributes('link').href;
    //     const url = window.prompt('URL', previousUrl);

    //     // cancelled
    //     if (url === null) {
    //         return;
    //     }

    //     // empty
    //     if (url === '') {
    //         editor.chain().focus().extendMarkRange('link').unsetLink().run();
    //         return;
    //     }

    //     // update link
    //     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    // }, [editor]);

    return (
        <div className="flex h-12 border border-input bg-transparent rounded-lg px-1 py-1 space-x-3">
            <Toggle size={'sm'} pressed={editor.isActive('heading')} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <Heading1Icon className="h-4 w-4" />
            </Toggle>
            <Separator orientation="vertical" />
            <Toggle size={'sm'} pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                <BoldIcon className="h-4 w-4" />
            </Toggle>
            <Toggle size={'sm'} pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                <ItalicIcon className="h-4 w-4" />
            </Toggle>
            <Toggle size={'sm'} pressed={editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            {/*
            <Separator orientation="vertical" />
            <Toggle size={'sm'} pressed={editor.isActive('link')} onPressedChange={setLink}>
                <LinkIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
                size={'sm'}
                pressed={editor.isActive('link')}
                onPressedChange={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
            >
                <Link2Off className="h-4 w-4" />
            </Toggle>
            */}
            <Separator orientation="vertical" />
            <Toggle size={'sm'} pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrderedIcon className="h-4 w-4" />
            </Toggle>
            <Toggle size={'sm'} pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
                <ListIcon className="h-4 w-4" />
            </Toggle>
            <Separator orientation="vertical" />
            <Toggle size={'sm'} pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
                <QuoteIcon className="h-4 w-4" />
            </Toggle>
            <Toggle size={'sm'} pressed={editor.isActive('codeBlock')} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
                <Code2 className="h-4 w-4" />
            </Toggle>
        </div>
    );
};

interface TipTapEditorProps {
    description: string;
    onChange: (richText: string) => void;
}

function TipTapEditor({ description, onChange }: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Paragraph.configure({
                // HTMLAttributes: {
                //     class: ''
                // }
            }),
            Bold.configure({
                // HTMLAttributes: {
                //     class: 'font-bold'
                // }
            }),
            Underline,
            Link.configure({
                // HTMLAttributes: {
                //     class: 'inline-flex items-center gap-x-1 text-blue-500 decoration-2 hover:underline font-medium'
                // }
            }),
            BulletList.configure({
                // keepMarks: false,
                // keepAttributes: false,
                // HTMLAttributes: {
                //     class: 'list-disc list-inside'
                // }
            }),
            OrderedList.configure({
                // keepMarks: true,
                // keepAttributes: false,
                // HTMLAttributes: {
                //     class: 'list-decimal list-inside'
                // }
            }),
            Blockquote.configure({
                // HTMLAttributes: {
                //     class: 'text-gray-800 sm:text-xl'
                // }
            }),
            Heading.configure({
                HTMLAttributes: {
                    levels: [1],
                    class: 'text-3xl font-bold'
                }
            })
        ],
        editorProps: {
            attributes: {
                class: 'rounded-lg border min-h-[150px] bg-background p-4 focus:outline-none'
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        content: `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
        display: none;
      }</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `
    });

    return (
        <div className="flex flex-col justify-stretch min-h-[250px] gap-2">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}

export default TipTapEditor;
