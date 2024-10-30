import MainLayout from "~/components/main-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import type { NextPageWithLayout } from "../../_app";
import { useEffect, type ReactElement } from "react";
import Head from "next/head";
import Link from "next/link";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nama harus diisi",
  }),
});

const AddMustahikCategory: NextPageWithLayout = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutate, isSuccess, isError, error, isPending, reset } =
    api.mustahikCategory.create.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Kategori Mustahik berhasil ditambahkan",
      });
      router.push("/kategori?tabs=mustahik");
      reset();
    }
  }, [isSuccess, router, toast, reset]);

  useEffect(() => {
    if (isError) {
      toast({
        title: error.message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  return (
    <>
      <Head>
        <title>Tambah Kategori Mustahik</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/">Beranda</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/kategori?tabs=mustahik">Daftar Kategori</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tambah Kategori Mustahik</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Tambah Kategori Mustahik
        </h2>
        <div className="container mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-xl space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                Tambah
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

AddMustahikCategory.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default AddMustahikCategory;
