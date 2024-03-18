'use client';

import React from 'react';

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

import { BoldIcon, Code2, Heading1Icon, ItalicIcon, ListIcon, ListOrderedIcon, QuoteIcon, UnderlineIcon } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface toolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    editor: Editor | null;
}

const Toolbar = ({ editor, className }: toolbarProps) => {
    if (!editor) {
        return null;
    }

    return (
        <div className={cn('flex h-12 border border-input bg-transparent rounded-lg px-1 py-1 space-x-3', className)}>
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

interface tipTapEditorProps {
    description: string;
    onChange: (richText: string) => void;
    className?: string;
}

function TipTapEditor({ description, onChange, className }: tipTapEditorProps) {
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
        content: description
    });

    return (
        <div className={cn('flex flex-col justify-stretch min-h-[250px] gap-2', className)}>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}

export default TipTapEditor;
