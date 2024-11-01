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
import { Combobox } from "~/components/ui/combobox";
import { api } from "~/utils/api";

import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";
import { parseCurrency } from "~/utils/parse";

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
import { useMaskito } from "@maskito/react";
import { DatePicker } from "~/components/ui/date-picker";
import { useSession } from "next-auth/react";

const AddZakatRecord: NextPageWithLayout = () => {
  const inputRef = useMaskito({ options: maskitoCurrency });
  const { toast } = useToast();
  const router = useRouter();
  const { mutate, isSuccess, isError, error, isPending, reset } =
    api.zakatRecord.create.useMutation();
  const { data: sessionData } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateReceived: new Date(),
      userId: "",
      muzakkiId: "",
      periodId: "",
      amount: "",
      type: "BERAS",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedConversionRate = parseCurrency(values.amount);
    const updatedValues = {
      ...values,
      amount: parsedConversionRate,
    };
    mutate(updatedValues);
  }

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
      toast({
        title: "Penerimaan Zakat berhasil ditambahkan",
      });
      router.push("/penerimaan");
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

  useEffect(() => {
    if (sessionData) {
      form.setValue("userId", sessionData.user.id);
    }
  }, [sessionData, form]);

  return (
    <>
      <Head>
        <title>Tambah Penerimaan Zakat</title>
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
                <BreadcrumbPage>Tambah Penerimaan Zakat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Tambah Penerimaan Zakat
        </h2>
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Muzakki</FormLabel>
                    <FormControl>
                      <Combobox
                        form={form}
                        field={field}
                        name="muzakkiId"
                        options={muzakkiOptions}
                        selectPlaceHolder="Pilih Muzakki..."
                      />
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
                      <Combobox
                        form={form}
                        field={field}
                        name="periodId"
                        options={periodOptions}
                        selectPlaceHolder="Pilih Periode..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tipe</FormLabel>
                    <FormControl>
                      <Combobox
                        form={form}
                        field={field}
                        name="type"
                        options={typeOptions}
                        selectPlaceHolder="Pilih Tipe..."
                      />
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
                      <Input
                        {...field}
                        ref={inputRef}
                        onInput={(e) =>
                          form.setValue("amount", e.currentTarget.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateReceived"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Diterima</FormLabel>
                    <FormControl>
                      <DatePicker field={field} />
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

AddZakatRecord.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default AddZakatRecord;
