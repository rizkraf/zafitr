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
  zakatRecordId: z.string().min(1, {
    message: "Distribusi Zakat harus diisi",
  }),
  mustahikId: z.string().min(1, {
    message: "Mustahik harus diisi",
  }),
  amount: z.coerce.string().min(1, {
    message: "Jumlah harus diisi",
  }),
  dateDistribution: z.date(),
});

import { maskitoCurrency } from "~/utils/mask";
import { DatePicker } from "~/components/ui/date-picker";
import dayjs from "dayjs";

const DetailZakatDistribution: NextPageWithLayout = () => {
  const inputRef = useMaskito({ options: maskitoCurrency });
  const router = useRouter();
  const { toast } = useToast();
  const { data, refetch, isFetching } =
    api.zakatDistribution.getDetail.useQuery(router.query.id as string);
  const { mutate, isSuccess, isError, error, isPending, reset } =
    api.zakatDistribution.update.useMutation();

  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zakatRecordId: "",
      mustahikId: "",
      amount: "",
      dateDistribution: new Date(),
    },
    values: {
      zakatRecordId: data?.data?.zakatRecord.id ?? "",
      mustahikId: data?.data?.mustahik.id ?? "",
      amount: data?.data?.amount.toString() ?? "",
      dateDistribution: data?.data?.dateDistribution ?? new Date(),
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

  const zakatRecord = api.zakatRecord.getAll.useQuery().data;
  const zakatRecordOptions: { label: string; value: string }[] =
    zakatRecord?.data?.map((record) => ({
      label: `${record.transactionNumber} - ${formatedCurrency(record.amount)}`,
      value: record.id,
    })) ?? [];

  const mustahik = api.mustahik.getAll.useQuery().data;
  const mustahikOptions: { label: string; value: string }[] =
    mustahik?.data?.map((msthk) => ({
      label: msthk.name,
      value: msthk.id,
    })) ?? [];

  useEffect(() => {
    if (isSuccess) {
      void refetch();
      toast({
        title: "Distribusi Zakat berhasil diubah",
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
        <title>Detail Distribusi Zakat</title>
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
                  <Link href="/distribusi">Daftar Distribusi Zakat</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail Distribusi Zakat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Detail Distribusi Zakat
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
                  name="zakatRecordId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Transaksi Penerimaan Zakat</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Combobox
                            form={form}
                            field={field}
                            name="zakatRecordId"
                            options={zakatRecordOptions}
                            selectPlaceHolder="Pilih No. Transaksi Penerimaan Zakat..."
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.zakatRecord.transactionNumber}
                          </p>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mustahikId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Mustahik</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <Combobox
                            form={form}
                            field={field}
                            name="mustahikId"
                            options={mustahikOptions}
                            selectPlaceHolder="Pilih Mustahik..."
                          />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {data?.data?.mustahik.name}
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
                  name="dateDistribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Distribusi</FormLabel>
                      <FormControl>
                        {isEdit ? (
                          <DatePicker field={field} />
                        ) : (
                          <p className="leading-7 [&:not(:first-child)]:mt-6">
                            {dayjs(data?.data?.dateDistribution).format(
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

DetailZakatDistribution.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default DetailZakatDistribution;
