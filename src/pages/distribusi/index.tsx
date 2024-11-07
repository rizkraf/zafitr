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
import { useEffect, useState, type ReactElement } from "react";
import Head from "next/head";
import { DataTable } from "../../components/data-table";
import { columns } from "../../components/columns/distribusi";
import { api } from "~/utils/api";
import {
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Loading } from "~/components/loading";
import { Trash } from "lucide-react";
import { useToast } from "~/hooks/use-toast";

const ZakatDistribution: NextPageWithLayout = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [searchDebounce] = useDebounce(search, 500);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "transactionNumber", desc: false },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isFetching, isRefetching, refetch } =
    api.zakatDistribution.getList.useQuery({
      pagination,
      search: searchDebounce,
      sorting,
    });

  const { mutate, error, isSuccess, isError } =
    api.zakatDistribution.deleteMany.useMutation();

  async function handleDelete() {
    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key],
    );
    mutate(selectedIds);
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Berhasil menghapus distribusi zakat",
      });
      setRowSelection({});
      void refetch();
    }
  }, [isSuccess, toast, refetch]);

  useEffect(() => {
    if (isError) {
      toast({
        title: error.message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const buttons = (
    <div className="flex flex-row space-x-3">
      {Object.keys(rowSelection).filter((key) => rowSelection[key]).length >
        0 && (
        <Button variant="destructive" onClick={handleDelete}>
          <Trash className="h-4 w-4" /> Hapus Distribusi Zakat
        </Button>
      )}
      <Button asChild>
        <Link href="/distribusi/add">Tambah Distribusi Zakat</Link>
      </Button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Distribusi Zakat</title>
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
                <BreadcrumbPage>Daftar Distribusi Zakat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Daftar Distribusi Zakat
        </h2>
        {isRefetching || isFetching ? (
          <Loading>Loading...</Loading>
        ) : (
          <div className="container mx-auto">
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              pagination={pagination}
              setPagination={setPagination}
              pageCount={data?.meta.totalPage ?? 0}
              sorting={sorting}
              setSorting={setSorting}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              search={search}
              setSearch={setSearch}
              searchPlaceholder="Cari Distribusi Zakat"
              buttons={buttons}
            />
          </div>
        )}
      </div>
    </>
  );
};

ZakatDistribution.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default ZakatDistribution;