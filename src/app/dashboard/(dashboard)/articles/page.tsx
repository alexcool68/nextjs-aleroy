'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { Plus, Trash, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import TitleHeader from '@/app/dashboard/_components/title-header';

import PublishedInfo from './_components/published-info';

import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

export default function ArticlesDashboard() {
    const [category, setCategory] = useState<string>('');

    const articles = useQuery(api.articles.getArticles, { deletedOnly: false, publishedOnly: false });
    const categories = useQuery(api.categories.getCategories, {});
    const addCategory = useMutation(api.categories.createCategory);
    const deleteCategory = useMutation(api.categories.deleteCategory);

    return (
        <>
            <div className="md:p-5">
                <TitleHeader title="Categories">
                    <div className="flex flex-row items-center justify-end gap-2"></div>
                </TitleHeader>
                <div className="my-5">
                    <div className="flex flex-row space-x-5 my-8">
                        <Input title="category" name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                        <Button
                            variant={'secondary'}
                            size={'sm'}
                            onClick={async () => {
                                if (category) {
                                    await addCategory({ title: category });
                                    setCategory('');
                                }
                            }}
                        >
                            Add
                        </Button>
                    </div>
                    {categories && (
                        <div className="flex flex-row items-center justify-start gap-2">
                            {categories.map((category) => (
                                <Badge variant={'outline'} className="inline-flex items-center justify-between" key={category._id}>
                                    <span>{category.title}</span>
                                    <X
                                        className="w-4 h-4 ml-2 cursor-pointer text-secondary"
                                        onClick={() => deleteCategory({ categoryId: category._id })}
                                    />
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <TitleHeader title="Articles">
                    <div className="flex flex-row items-center justify-end gap-2">
                        <Button variant={'secondary'} size={'sm'} asChild>
                            <Link href="/dashboard/articles/add">
                                <Plus className="w-4 h-4 lg:mr-2" />
                                <span className="hidden lg:block">Add</span>
                            </Link>
                        </Button>
                        <Button variant={'secondary'} size={'sm'} asChild>
                            <Link href="/dashboard/articles/trash">
                                <Trash className="w-4 h-4 lg:mr-2" />
                                <span className="hidden lg:block">Trash</span>
                            </Link>
                        </Button>
                    </div>
                </TitleHeader>
                <div className="my-5">
                    <PublishedInfo />
                    {articles && <DataTable columns={columns} data={articles} />}
                </div>
            </div>
        </>
    );
}
