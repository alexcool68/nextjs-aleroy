'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

import { useToast } from '@/components/ui/use-toast';

//import { UploadButton, UploadDropzone, UploadFileResponse } from '@xixixao/uploadstuff/react';
// import '@xixixao/uploadstuff/react/styles.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ReactQuill from 'react-quill';
import '../../../quill.snow.css';

import { ArrowLeftFromLineIcon } from 'lucide-react';

import { getImageUrl } from '@/lib/utils';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import { useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';

import TitleHeader from '@/app/dashboard/_components/title-header';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.'
    }),
    content: z.string().min(25, {
        message: 'Content must be at least 25 characters.'
    }),
    imgId: z.string().optional(),
    isPublished: z.boolean()
});

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

export default function ArticlesAddDashboard() {
    const { toast } = useToast();
    const { push } = useRouter();

    // const [imageA, setImageA] = useState('');

    // const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createArticle = useMutation(api.articles.createArticle);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: '',
            imgId: '',
            isPublished: false
        }
    });

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            [{ color: [] }],
            ['code-block'],
            ['clean']
        ]
    };

    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        'image',
        'align',
        'color',
        'code-block'
    ];
    const editorContent = form.watch('content');
    const onEditorStateChange = (editorState: any) => {
        form.setValue('content', editorState);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            createArticle({ title: values.title, content: values.content, isPublished: values.isPublished, imgId: values.imgId });
            form.reset();
            toast({
                variant: 'default',
                title: 'Article added'
            });

            push('/dashboard/articles');
        } catch (error) {
            console.log(error);
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Saved article had failed, try again later'
            });
        }
    }

    async function onFakeSubmit(nbr: number = 1) {
        try {
            for (let index = 0; index < nbr; index++) {
                const random = Math.floor(Math.random() * 100) + 1;
                const json = await fetch(`https://dummyjson.com/posts/${random}`, { method: 'GET' });
                const result = await json.json();
                if (result) {
                    await createArticle({
                        title: result.title,
                        content: result.body,
                        isPublished: true,
                        imgId: 'kg229rt33nv3h7s54esx8pbq4h6n9e27'
                    });
                }
            }
            toast({
                variant: 'default',
                title: 'Article added'
            });

            push('/dashboard/articles');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="md:p-5">
            <TitleHeader title="Articles">
                <div className="flex flex-row items-center justify-end gap-2">
                    <Button variant={'destructive'} size={'sm'} onClick={() => onFakeSubmit()} className="flex gap-1">
                        01 <span className="hidden lg:block">{' fake Articles'}</span>
                    </Button>
                    <Button variant={'destructive'} size={'sm'} onClick={() => onFakeSubmit(10)} className="flex gap-1">
                        10 <span className="hidden lg:block">{' fake Articles'}</span>
                    </Button>
                    <Button variant={'secondary'} size={'sm'} asChild>
                        <Link href="/dashboard/articles" className="flex items-center h-8">
                            <ArrowLeftFromLineIcon className="w-4 h-4 mr-2" /> Back
                        </Link>
                    </Button>
                </div>
            </TitleHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className="space-y-5">
                        {/* <h3 className="mb-4 text-lg font-medium">Image cover</h3> */}

                        {/* {imageA && (
                            <div className="relative aspect-[1280/720]">
                                <Image alt="image test a" className="object-cover" src={getImageUrl(imageA)} layout="fill" />
                            </div>
                        )} */}

                        {/* <FormField
                            control={form.control}
                            name="imgId"
                            render={({ field }) => (
                                <UploadDropzone
                                    uploadUrl={generateUploadUrl}
                                    multiple={false}
                                    fileTypes={{
                                        'image/*': ['.png', '.gif', '.jpeg', '.jpg']
                                    }}
                                    onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                                        setImageA((uploaded[0].response as any).storageId);
                                        form.setValue('imgId', (uploaded[0].response as any).storageId);
                                    }}
                                    onUploadError={(error: unknown) => {
                                        alert(`ERROR! ${error}`);
                                    }}
                                />

                            )}
                        /> */}

                        <h3 className="mb-4 text-lg font-medium text-center">Title and content</h3>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="This is a title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <QuillEditor
                                    theme="snow"
                                    value={editorContent}
                                    onChange={onEditorStateChange}
                                    className="py-0 my-10 bg-background border rounded-lg"
                                    modules={quillModules}
                                    formats={quillFormats}
                                />
                                // <FormItem>
                                //     <FormLabel className="text-base">Content</FormLabel>
                                //     <FormControl>
                                //         <Textarea className="resize-y" {...field} />
                                //     </FormControl>
                                //     <FormMessage />
                                // </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Content</FormLabel>
                                    <FormControl>
                                        <Textarea className="resize-y" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    <div className="space-y-5">
                        <h3 className="mb-4 text-lg font-medium text-center">Options</h3>

                        <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Publish this article</FormLabel>
                                        <FormDescription>If this article is published, it will appear on the website</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-5">
                        <h3 className="mb-4 text-lg font-medium text-center">Categories</h3>
                    </div>

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}
