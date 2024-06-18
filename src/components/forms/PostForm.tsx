
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import Loader from "../shared/Loader"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
}
const PostForm = ({ post,action }: PostFormProps) => {
    
    const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();

    const { mutateAsync: updatePost, isPending : isLoadingUpdate } =
        useUpdatePost();
    
    const { user } = useUserContext();
    const { toast } = useToast();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
          description: post ? post?.description : '',
          tags: post ? post.tags.join(",") : "",
        },
      })
     
      // 2. Define a submit handler.
      const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
        // ACTION = UPDATE
        if (post && action === "Update") {
          const updatedPost = await updatePost({
            ...value,
            postId: post.$id,
            imageId: post?.imageId,
            imageUrl: post?.imageUrl,
          });
    
          if (!updatedPost) {
            toast({
              title: `${action} post failed. Please try again.`,
            });
          }
          return navigate(`/posts/${post.$id}`);
        }
    
        // ACTION = CREATE
        const newPost = await createPost({
          ...value,
          userId: user.id,
        });
    
        if (!newPost) {
          toast({
            title: `${action} post failed. Please try again.`,
          });
        }
        navigate("/");
      };
    
  return (
      <div>
          <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Ingredients (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Bun, cheese, chicken"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
          />


        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Description and Process</FormLabel>
              <FormControl>
              <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
              />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />


        <div className="flex gap-4 items-center justify-end">
        <Button type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
        </Button>
        <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>


      </form>
    </Form>
    </div>
  )
}

export default PostForm