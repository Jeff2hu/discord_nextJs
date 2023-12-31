"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-model-store";
import { ChannelType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is required.",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be general",
    }),
  type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  const params = useParams();

  const isModalOpen = isOpen && type === "createChannel";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringify({
        url: "/api/channels",
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 ring-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 outline-none "
                        placeholder="Enter channel name"
                        {...field}
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
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 ring-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 outline-none capitalize">
                          <SelectValue placeholder="Please select channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(ChannelType).map((typeValue) => (
                            <SelectItem
                              key={typeValue}
                              value={typeValue}
                              className="capitalize"
                            >
                              {typeValue.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
