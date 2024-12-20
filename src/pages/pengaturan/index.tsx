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
import { useSession } from "next-auth/react";
import { Label } from "~/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nama harus diisi",
  }),
});

const SettingCurrentUser: NextPageWithLayout = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: sessionData } = useSession();
  const { data, refetch, isFetching } = api.user.getCurrentUser.useQuery(
    sessionData?.user?.id ? { id: sessionData.user.id } : { id: "" },
  );
  const { mutate, isSuccess, isError, error, isPending, reset } =
    api.user.updateCurrentUser.useMutation();

  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
    values: {
      name: data?.data?.name ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      id: sessionData?.user?.id ? sessionData.user.id : "",
      ...values,
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
        title: "Akun berhasil diubah",
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
        <title>Pengaturan Akun</title>
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
              <BreadcrumbItem>
                <BreadcrumbPage>Pengaturan Akun</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Pengaturan Akun
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
                <div className="space-y-2">
                  <Label>Username</Label>
                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    {data?.data?.username}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    {data?.data?.role}
                  </p>
                </div>
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

SettingCurrentUser.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default SettingCurrentUser;
