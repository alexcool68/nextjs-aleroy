'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import Image from 'next/image';

import { useToast } from '@/components/ui/use-toast';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { ArrowLeftFromLineIcon, X } from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

import Loader from '@/components/loader';
import CustomDragDrop from '@/app/dashboard/_components/custom-drag-drop';
import TipTapEditor from '@/app/dashboard/_components/tip-tap-editor';
import TitleHeader from '@/app/dashboard/_components/title-header';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.'
    }),
    content: z.string().min(2, {
        message: 'Content must be at least 25 characters.'
    }),
    imgId: z.string().optional(),
    categories: z.array(z.any()),
    isPublished: z.boolean()
});

export default function ArticlesAddDashboard() {
    const { toast } = useToast();
    const { push } = useRouter();

    const [progress, setProgress] = useState<{ total: number; value: number }>({ total: 0, value: 0 });
    const [loading, setLoading] = useState<boolean>(false);

    const [file, setFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState('');
    const [removeFile, setRemoveFile] = useState(false);

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const createArticle = useMutation(api.articles.createArticle);
    const categories = useQuery(api.categories.getCategories, {});

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: '',
            imgId: '',
            categories: [],
            isPublished: false
        }
    });

    const generatePreview = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewURL(reader.result as string);
        };
    };

    const handleUpdateFile = (file: File) => {
        const isValid = file.type === 'image/png' || file.type === 'image/jpeg';
        if (!isValid) {
            alert('Please upload a valid image file');
            return;
        }
        generatePreview(file);
        setFile(file);
        setRemoveFile(false);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreviewURL('');
        setRemoveFile(true);
    };

    const uploadToServer = async () => {
        const imgUrl = await generateUploadUrl();

        const result = await fetch(imgUrl, {
            method: 'POST',
            headers: { 'Content-Type': file!.type },
            body: file
        });

        const { storageId } = await result.json();

        return storageId;
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            let storageId = undefined;

            if (file) {
                storageId = await uploadToServer();
            }

            createArticle({
                title: values.title,
                content: values.content,
                isPublished: values.isPublished,
                imgId: storageId,
                categories: values.categories
            });

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
                setLoading(true);
                setProgress({ total: nbr, value: index + 1 });

                // const random = Math.floor(Math.random() * 100) + 1;
                const random = Math.floor(Math.random() * (150 - 1 + 1) + 1);

                const getRandomPost = await fetch(`https://dummyjson.com/posts/${random}`, { method: 'GET' });
                const randomPost = await getRandomPost.json();

                const getBaconText = await fetch(`https://baconipsum.com/api/?type=meat-and-filler`, { method: 'GET' });
                const baconText = await getBaconText.json();

                const newImageUrl = await generateUploadUrl();

                const getImageFromPicsum = await fetch(`https://picsum.photos/800/400`, { method: 'GET' });
                const image = await getImageFromPicsum.blob();

                const uploadedImageResult = await fetch(newImageUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': image!.type },
                    body: image
                });

                const { storageId } = await uploadedImageResult.json();

                await createArticle({
                    title: randomPost.title,
                    content: `<p>${baconText[0]}</p><p>${baconText[1]}</p><p>${baconText[2]}</p><p>${baconText[3]}</p><p>${baconText[4]}</p>`,
                    isPublished: true,
                    imgId: storageId
                });
            }
            // setLoading(false)
            toast({
                variant: 'default',
                title: 'Articles added'
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
                    <Button variant={'destructive'} size={'sm'} onClick={() => onFakeSubmit()} className="flex gap-1" disabled={loading}>
                        01 <span className="hidden lg:block">{' fake Articles'}</span>
                    </Button>
                    <Button variant={'destructive'} size={'sm'} onClick={() => onFakeSubmit(10)} className="flex gap-1" disabled={loading}>
                        10 <span className="hidden lg:block">{' fake Articles'}</span>
                    </Button>
                    <Button variant={'secondary'} size={'sm'} asChild>
                        <Link href="/dashboard/articles" className="flex items-center h-8">
                            <ArrowLeftFromLineIcon className="w-4 h-4 mr-2" /> Back
                        </Link>
                    </Button>
                </div>
            </TitleHeader>
            {loading ? (
                <>
                    <div className="flex flex-col items-center justify-center gap-5">
                        <p>
                            Progress : {progress.value} / {progress.total}
                        </p>
                        <Progress value={Math.floor((progress.value / progress.total) * 100)} className="w-full" />
                        <Loader />
                    </div>
                </>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                            <div className="space-y-5">
                                <h3 className="mb-4 text-lg font-medium">Image cover</h3>

                                {!file && <CustomDragDrop updateFileUpload={handleUpdateFile} removeFile={removeFile} />}

                                {file && (
                                    <div className="p-2 text-center bg-background border border-dashed rounded-lg flex items-center justify-center">
                                        <div className="relative flex flex-col gap-2 w-full max-w-md">
                                            {previewURL && (
                                                <Image
                                                    src={previewURL}
                                                    alt={'preview image'}
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    style={{ width: '100%', height: 'auto' }}
                                                    className="rounded-lg aspect-[1.6]"
                                                />
                                            )}

                                            {previewURL && (
                                                <div className="absolute top-0 left-0 flex flex-col items-center justify-center gap-2 text-primary w-full h-full bg-background/80">
                                                    <button onClick={handleRemoveFile} type="button" className="w-5 h-5">
                                                        <X className="icon" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

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
                                        <FormItem>
                                            <FormLabel className="text-base">Content</FormLabel>
                                            <FormControl>
                                                <TipTapEditor description={field.name} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                <FormField
                                    control={form.control}
                                    name="categories"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Categories</FormLabel>
                                                <FormDescription>Select the categories you want to add to the article.</FormDescription>
                                            </div>
                                            {categories &&
                                                categories.map((item) => (
                                                    <FormField
                                                        key={item._id}
                                                        control={form.control}
                                                        name="categories"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem key={item._id} className="flex flex-row items-start space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item._id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item._id])
                                                                                    : field.onChange(
                                                                                          field.value?.filter((value) => value !== item._id)
                                                                                      );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">{item.title}</FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>

                    <Separator className="my-5" />

                    <div>
                        <div className="article article-invert max-w-none" dangerouslySetInnerHTML={{ __html: form.getValues('content') }} />
                    </div>
                </>
            )}
        </div>
    );
}
