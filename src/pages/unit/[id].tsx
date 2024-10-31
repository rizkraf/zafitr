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
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";
import { Loading } from "~/components/loading";
import { formatedCurrency, parseCurrency } from "~/utils/parse";
import { Combobox } from "~/components/ui/combobox";
import options from "~/utils/mask";
import { useMaskito } from "@maskito/react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nama harus diisi",
  }),
  type: z.enum(["BERAS", "UANG"], {
    message: "Tipe harus diisi",
  }),
  conversionRate: z.coerce.string().min(1, {
    message: "Konversi harus diisi",
  }),
});

const DetailZakatUnit: NextPageWithLayout = () => {
  const inputRef = useMaskito({ options });
  const unitType = [
    { value: "BERAS", label: "BERAS" },
    { value: "UANG", label: "UANG" },
  ];
  const router = useRouter();
  const { toast } = useToast();
  const { data, refetch, isFetching } = api.zakatUnit.getDetail.useQuery(
    router.query.id as string,
  );
  const { mutate, isSuccess, isError, error, isPending, reset } =
    api.zakatUnit.update.useMutation();

  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "BERAS",
      conversionRate: "",
    },
    values: {
      name: data?.data?.name ?? "",
      type: data?.data?.type ?? "BERAS",
      conversionRate: data?.data?.conversionRate.toString() ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedConversionRate = parseCurrency(values.conversionRate);
    const updatedValues = {
      ...values,
      conversionRate: parsedConversionRate,
    };
    mutate({
      id: router.query.id as string,
      ...updatedValues,
    });
  }

  const handleIsEdit = useCallback(() => {
    setIsEdit(!isEdit);
    form.reset();
  }, [isEdit, form]);

  useEffect(() => {
    if (isSuccess) {
      void refetch();
      toast({
        title: "Unit Zakat berhasil diubah",
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
        <title>Detail Unit Zakat</title>
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
                  <Link href="/unit">Daftar Unit Zakat</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail Unit Zakat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Detail Unit Zakat
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Combobox
                            form={form}
                            field={field}
                            name="type"
                            options={unitType}
                            selectPlaceHolder="Pilih Tipe..."
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.type}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="conversionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konversi</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Input
                            {...field}
                            ref={inputRef}
                            onInput={(e) =>
                              form.setValue(
                                "conversionRate",
                                e.currentTarget.value,
                              )
                            }
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {formatedCurrency(data?.data?.conversionRate ?? 0)}
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

DetailZakatUnit.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default DetailZakatUnit;
