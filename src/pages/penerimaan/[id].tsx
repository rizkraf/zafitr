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
import { Combobox } from "~/components/ui/combobox";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";
import { Loading } from "~/components/loading";
import { formatedCurrency, parseCurrency } from "~/utils/parse";
import { useMaskito } from "@maskito/react";

const formSchema = z.object({
  dateReceived: z.date(),
  userId: z.string().min(1, {
    message: "User harus diisi",
  }),
  muzakkiId: z.string().min(1, {
    message: "Muzakki harus diisi",
  }),
  periodId: z.string().min(1, {
    message: "Periode harus diisi",
  }),
  amount: z.coerce.string().min(1, {
    message: "Jumlah harus diisi",
  }),
  type: z.enum(["BERAS", "UANG"]),
});

import { maskitoCurrency } from "~/utils/mask";
import { DatePicker } from "~/components/ui/date-picker";
import dayjs from "dayjs";

const DetailZakatRecord: NextPageWithLayout = () => {
  const inputRef = useMaskito({ options: maskitoCurrency });
  const router = useRouter();
  const { toast } = useToast();
  const { data, refetch, isFetching } = api.zakatRecord.getDetail.useQuery(
    router.query.id as string,
  );
  const { mutate, isSuccess, isError, error, isPending, reset } =
    api.zakatRecord.update.useMutation();

  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      muzakkiId: "",
      userId: "",
      periodId: "",
      amount: "",
      type: "BERAS",
      dateReceived: new Date(),
    },
    values: {
      muzakkiId: data?.data?.muzakki.id ?? "",
      userId: data?.data?.user.id ?? "",
      periodId: data?.data?.period.id ?? "",
      amount: data?.data?.amount.toString() ?? "",
      type: data?.data?.type ?? "BERAS",
      dateReceived: new Date(data?.data?.dateReceived ?? ""),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedConversionRate = parseCurrency(values.amount);
    const updatedValues = {
      ...values,
      amount: parsedConversionRate,
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

  const muzakki = api.muzakki.getAll.useQuery().data;
  const muzakkiOptions: { label: string; value: string }[] =
    muzakki?.data?.map((mzk) => ({
      label: mzk.name,
      value: mzk.id,
    })) ?? [];

  const period = api.zakatPeriod.getAll.useQuery().data;
  const periodOptions: { label: string; value: string }[] =
    period?.data?.map((prd) => ({
      label: prd.name,
      value: prd.id,
    })) ?? [];

  const typeOptions = [
    { label: "BERAS", value: "BERAS" },
    { label: "UANG", value: "UANG" },
  ];

  useEffect(() => {
    if (isSuccess) {
      void refetch();
      toast({
        title: "Penerimaan Zakat berhasil diubah",
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
        <title>Detail Penerimaan Zakat</title>
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
                  <Link href="/penerimaan">Daftar Penerimaan Zakat</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail Penerimaan Zakat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Detail Penerimaan Zakat
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
                  name="muzakkiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Muzakki</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Combobox
                            form={form}
                            field={field}
                            name="muzakkiId"
                            options={muzakkiOptions}
                            selectPlaceHolder="Pilih Muzakki..."
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.muzakki.name}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="periodId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Periode</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Combobox
                            form={form}
                            field={field}
                            name="periodId"
                            options={periodOptions}
                            selectPlaceHolder="Pilih Periode..."
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.period.name}
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
                            options={typeOptions}
                            selectPlaceHolder="Pilih Tipe..."
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.type ?? "-"}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Besaran Zakat</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Input
                            {...field}
                            ref={inputRef}
                            onInput={(e) =>
                              form.setValue("amount", e.currentTarget.value)
                            }
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {formatedCurrency(data?.data?.amount ?? 0) ?? "-"}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateReceived"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Diterima</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <DatePicker field={field} />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {dayjs(data?.data?.dateReceived).format(
                              "DD MMMM YYYY",
                            )}
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

DetailZakatRecord.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default DetailZakatRecord;
