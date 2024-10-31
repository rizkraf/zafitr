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
import type { NextPageWithLayout } from "../_app";
import { useCallback, useEffect, useState, type ReactElement } from "react";
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
import { Textarea } from "~/components/ui/textarea";
import { Combobox } from "~/components/ui/combobox";
import PhoneInput from "react-phone-number-input/input";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";
import { Loading } from "~/components/loading";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nama harus diisi",
  }),
  muzakkiCategoryId: z.string().min(1, {
    message: "Kategori harus diisi",
  }),
  email: z.union([
    z.string().email({
      message: "Email tidak valid",
    }),
    z.literal(""),
  ]),
  phone: z.string(),
  address: z.string().min(1, {
    message: "Alamat harus diisi",
  }),
});

const DetailMuzakki: NextPageWithLayout = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data, refetch, isFetching } = api.muzakki.getDetail.useQuery(
    router.query.id as string,
  );
  const { mutate, isSuccess, isError, error, isPending, reset } =
    api.muzakki.update.useMutation();

  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      muzakkiCategoryId: "",
      email: "",
      phone: "",
      address: "",
    },
    values: {
      name: data?.data?.name ?? "",
      muzakkiCategoryId: data?.data?.muzakkiCategory.id ?? "",
      email: data?.data?.email ?? "",
      phone: data?.data?.phone ?? "",
      address: data?.data?.address ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      id: router.query.id as string,
      ...values,
    });
  }

  const handleIsEdit = useCallback(() => {
    setIsEdit(!isEdit);
    form.reset();
  }, [isEdit, form]);

  const muzakkiCategory = api.muzakkiCategory.getAll.useQuery().data;
  const categoryOptions: { label: string; value: string }[] =
    muzakkiCategory?.data?.map((category: { name: string; id: string }) => ({
      label: category.name,
      value: category.id,
    })) ?? [];

  useEffect(() => {
    if (isSuccess) {
      void refetch();
      toast({
        title: "Muzakki berhasil diubah",
      });
      reset();
      handleIsEdit();
    }
  }, [isSuccess, router, toast, reset, handleIsEdit, refetch]);

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
        <title>Detail Muzakki</title>
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
                  <Link href="/muzakki">Daftar Muzakki</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail Muzakki</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Detail Muzakki
        </h2>
        {isFetching ? (
          <Loading>Loading...</Loading>
        ) : (
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
                        {isEdit ? (
                          <Input {...field} />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.name}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="muzakkiCategoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Kategori</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Combobox
                            form={form}
                            field={field}
                            name="muzakkiCategoryId"
                            options={categoryOptions}
                            selectPlaceHolder="Pilih Kategori..."
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.muzakkiCategory.name}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Input {...field} />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.email ?? "-"}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <PhoneInput
                            country="ID"
                            inputComponent={Input}
                            {...field}
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.phone ?? "-"}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Textarea className="resize-none" {...field} />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.address}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isEdit ? (
                  <div className="flex flex-row space-x-2">
                    <Button type="submit" disabled={isPending}>
                      Simpan
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleIsEdit}
                      disabled={isPending}
                    >
                      Batal
                    </Button>
                  </div>
                ) : (
                  <Button type="button" onClick={handleIsEdit}>
                    Ubah
                  </Button>
                )}
              </form>
            </Form>
          </div>
        )}
      </div>
    </>
  );
};

DetailMuzakki.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default DetailMuzakki;
