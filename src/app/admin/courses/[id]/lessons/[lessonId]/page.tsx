// "use client";

// import { useState, useCallback, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import TextAlign from "@tiptap/extension-text-align";
// import {
//   Bold,
//   Italic,
//   Strikethrough,
//   Heading1,
//   Heading2,
//   Heading3,
//   List,
//   ListOrdered,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   Undo,
//   Redo,
//   Upload,
//   Trash2,
// } from "lucide-react";
// import { ArrowLeft, Save } from "lucide-react";
// import Link from "next/link";
// import { useMutation, useQuery } from "convex/react";
// import { useDropzone } from "react-dropzone";
// import { useParams } from "next/navigation";
// import { toast } from "@/hooks/use-toast";
// import { Id } from "../../../../../../../convex/_generated/dataModel";
// import { api } from "../../../../../../../convex/_generated/api";

// export default function LessonPage() {
//   const params = useParams<{ id: string; lessonId: Id<"lessons"> }>();
//   const courseId = params.id as Id<"courses">;
//   const lessonId = params.lessonId;

//   const lesson = useQuery(api.lessons.getLessonById, { id: lessonId });
//   const updateLesson = useMutation(api.lessons.updateLesson);
//   const generateUploadUrl = useMutation(api.lessons.generateUploadUrl);
//   const videoUrl = useQuery(api.lessons.getVideoUrl, {
//     storageId: lesson?.video,
//   });

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
//   const [pending, setPending] = useState(false);

//   useEffect(() => {
//     if (lesson) {
//       setTitle(lesson.title || "");
//       setDescription(lesson.description || "");
//     }
//   }, [lesson]);

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//     ],
//     content: description,
//     onUpdate: ({ editor }) => {
//       setDescription(editor.getHTML());
//     },
//     immediatelyRender: false,
//   });

//   const isActive = (check: () => boolean | undefined): string => {
//     return editor
//       ? check()
//         ? "bg-[#195a5a]/60 text-white font-bold"
//         : "text-gray-300 hover:bg-[#195a5a]/20"
//       : "text-gray-300 hover:bg-[#195a5a]/20";
//   };

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const file = acceptedFiles[0];
//     if (file && file.type.startsWith("video/")) {
//       setVideoFile(file);
//       setLocalVideoUrl(URL.createObjectURL(file));
//     } else {
//       toast({
//         title: "Invalid file",
//         description: "Please upload a video file.",
//         variant: "destructive",
//       });
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "video/*": [] },
//     multiple: false,
//   });

//   const handleDeleteVideo = () => {
//     setVideoFile(null);
//     setLocalVideoUrl(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setPending(true);
//     try {
//       let storageId: Id<"_storage"> | undefined;
//       if (videoFile) {
//         const postUrl = await generateUploadUrl();
//         const result = await fetch(postUrl, {
//           method: "POST",
//           body: videoFile,
//         });
//         const { storageId: uploadedId } = await result.json();
//         storageId = uploadedId;
//       } else if (!localVideoUrl && lesson?.video) {
//         storageId = undefined; // Remove video if deleted
//       }

//       await updateLesson({
//         id: lessonId,
//         title,
//         description,
//         video: storageId,
//       });

//       toast({
//         title: "Lesson Updated",
//         description: "Your lesson has been successfully updated.",
//       });
//     } catch (error) {
//       console.error("Error updating lesson:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update lesson. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setPending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8">
//       <div className="max-w-4xl mx-auto space-y-8">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="outline"
//             className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm"
//             asChild
//           >
//             <Link href={`/admin/courses/${courseId}?view=structure`}>
//               <ArrowLeft className="w-5 h-5 mr-2" />
//               Back to Course
//             </Link>
//           </Button>
//           <h1 className="text-4xl font-extrabold text-[#195a5a] tracking-tight animate-fade-in">
//             Lesson Configuration
//           </h1>
//         </div>
//         <p className="text-lg text-[#2a7b7b]/70">
//           Configure the video and description for this lesson
//         </p>
//         <Card className="border-none bg-white/90 shadow-xl rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
//           <CardContent className="p-8 space-y-8">
//             <div className="space-y-3">
//               <Label
//                 htmlFor="title"
//                 className="text-sm font-semibold text-[#195a5a]"
//               >
//                 Lesson Title
//               </Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter lesson title"
//                 className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300"
//                 disabled={pending}
//               />
//             </div>

//             <div className="space-y-3">
//               <Label
//                 htmlFor="description"
//                 className="text-sm font-semibold text-[#195a5a]"
//               >
//                 Description
//               </Label>
//               <div className="border border-[#195a5a]/20 bg-white/50 rounded-md shadow-sm focus-within:outline-none">
//                 <div className="flex items-center px-2 py-1 bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white">
//                   <button
//                     onClick={() => editor?.chain().focus().toggleBold().run()}
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("bold"))}`}
//                   >
//                     <Bold className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => editor?.chain().focus().toggleItalic().run()}
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("italic"))}`}
//                   >
//                     <Italic className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => editor?.chain().focus().toggleStrike().run()}
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("strike"))}`}
//                   >
//                     <Strikethrough className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       editor?.chain().focus().toggleHeading({ level: 1 }).run()
//                     }
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("heading", { level: 1 }))}`}
//                   >
//                     <Heading1 className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       editor?.chain().focus().toggleHeading({ level: 2 }).run()
//                     }
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("heading", { level: 2 }))}`}
//                   >
//                     <Heading2 className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       editor?.chain().focus().toggleHeading({ level: 3 }).run()
//                     }
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("heading", { level: 3 }))}`}
//                   >
//                     <Heading3 className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       editor?.chain().focus().toggleBulletList().run()
//                     }
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("bulletList"))}`}
//                   >
//                     <List className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       editor?.chain().focus().toggleOrderedList().run()
//                     }
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("orderedList"))}`}
//                   >
//                     <ListOrdered className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       editor?.chain().focus().setTextAlign("left").run()
//                     }
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive({ textAlign: "left" }))}`}
//                   >
//                     <AlignLeft className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       editor?.chain().focus().setTextAlign("center").run()
//                     }
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive({ textAlign: "center" }))}`}
//                   >
//                     <AlignCenter className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       editor?.chain().focus().setTextAlign("right").run()
//                     }
//                     className={`px-2 py-1 rounded ${isActive(() => editor?.isActive({ textAlign: "right" }))}`}
//                   >
//                     <AlignRight className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => editor?.chain().focus().undo().run()}
//                     className={`px-2 py-1 rounded ${isActive(() => false)}`}
//                     disabled={!editor?.can().undo()}
//                   >
//                     <Undo className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => editor?.chain().focus().redo().run()}
//                     className={`px-2 py-1 rounded ${isActive(() => false)}`}
//                     disabled={!editor?.can().redo()}
//                   >
//                     <Redo className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <EditorContent
//                   editor={editor}
//                   className="p-2 min-h-[150px] focus-within:outline-none bg-white/50"
//                 />
//               </div>
//             </div>

//             <div className="space-y-3">
//               <Label
//                 htmlFor="video"
//                 className="text-sm font-semibold text-[#195a5a]"
//               >
//                 Video File
//               </Label>
//               <div
//                 {...getRootProps()}
//                 className={`border-2 border-dashed border-[#195a5a]/30 bg-white/70 rounded-lg p-6 text-center transition-all duration-300 ${
//                   isDragActive ? "bg-[#e6f4ea] border-[#195a5a]/50" : ""
//                 }`}
//               >
//                 <input {...getInputProps()} />
//                 <div className="flex flex-col items-center space-y-4">
//                   {localVideoUrl || videoUrl ? (
//                     <div className="relative w-full max-w-md">
//                       <video
//                         src={localVideoUrl || videoUrl || ""}
//                         controls
//                         className="w-full rounded-lg shadow-md"
//                       />
//                       <Button
//                         variant="destructive"
//                         size="icon"
//                         className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-8 h-8"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeleteVideo();
//                         }}
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ) : (
//                     <>
//                       <Upload className="mx-auto text-[#195a5a] w-16 h-16 mb-2 animate-pulse" />
//                       <p className="text-lg text-[#2a7b7b] mb-2">
//                         Drop your video file here or click to upload
//                       </p>
//                     </>
//                   )}
//                   <Button
//                     variant="outline"
//                     className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-md"
//                   >
//                     Select Video
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
//               onClick={handleSubmit}
//               disabled={pending}
//             >
//               <Save className="w-5 h-5 mr-2" />
//               Save Lesson
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Upload,
  Trash2,
} from "lucide-react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { useDropzone } from "react-dropzone";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";


export default function LessonPage() {
  const router = useRouter();
  const params = useParams<{ id: string; lessonId: Id<"lessons"> }>();
  const courseId = params.id as Id<"courses">;
  const lessonId = params.lessonId;

  const lesson = useQuery(api.lessons.getLessonById, { id: lessonId });
  const updateLesson = useMutation(api.lessons.updateLesson);
  const generateUploadUrl = useMutation(api.lessons.generateUploadUrl);
  const videoUrl = useQuery(api.lessons.getVideoUrl, {
    storageId: lesson?.video,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || "");
      setDescription(lesson.description || "");
    }
  }, [lesson]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const isActive = (check: () => boolean | undefined): string => {
    return editor
      ? check()
        ? "bg-[#195a5a]/60 text-white font-bold"
        : "text-gray-300 hover:bg-[#195a5a]/20"
      : "text-gray-300 hover:bg-[#195a5a]/20";
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setLocalVideoUrl(URL.createObjectURL(file));
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a video file.",
        variant: "destructive",
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    multiple: false,
  });

  const handleDeleteVideo = () => {
    setVideoFile(null);
    setLocalVideoUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      let storageId: Id<"_storage"> | undefined;
      if (videoFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          body: videoFile,
        });
        const { storageId: uploadedId } = await result.json();
        storageId = uploadedId;
      } else if (!localVideoUrl && lesson?.video) {
        storageId = undefined; // Remove video if deleted
      }

      await updateLesson({
        id: lessonId,
        title,
        description,
        video: storageId,
      });

      toast({
        title: "Lesson Updated",
        description: "Your lesson has been successfully updated.",
      });
      router.push(`/courses/${courseId}?lesson=${lessonId}`);
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to update lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] to-[#c3e6cb] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm"
            asChild
          >
            <Link href={`/admin/courses/${courseId}?view=structure`}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Course
            </Link>
          </Button>
          <h1 className="text-4xl font-extrabold text-[#195a5a] tracking-tight animate-fade-in">
            Lesson Configuration
          </h1>
        </div>
        <p className="text-lg text-[#2a7b7b]/70">
          Configure the video and description for this lesson
        </p>
        <Card className="border-none bg-white/90 shadow-xl rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-[#195a5a]"
              >
                Lesson Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lesson title"
                className="border-[#195a5a]/20 bg-white/50 focus:ring-[#195a5a] focus:border-[#195a5a] rounded-md shadow-sm transition-all duration-300"
                disabled={pending}
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-[#195a5a]"
              >
                Description
              </Label>
              <div className="border border-[#195a5a]/20 bg-white/50 rounded-md shadow-sm focus-within:outline-none">
                <div className="flex items-center px-2 py-1 bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("bold"))}`}
                  >
                    <Bold className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("italic"))}`}
                  >
                    <Italic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("strike"))}`}
                  >
                    <Strikethrough className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("heading", { level: 1 }))}`}
                  >
                    <Heading1 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("heading", { level: 2 }))}`}
                  >
                    <Heading2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("heading", { level: 3 }))}`}
                  >
                    <Heading3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("bulletList"))}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive("orderedList"))}`}
                  >
                    <ListOrdered className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("left").run()
                    }
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive({ textAlign: "left" }))}`}
                  >
                    <AlignLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("center").run()
                    }
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive({ textAlign: "center" }))}`}
                  >
                    <AlignCenter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("right").run()
                    }
                    className={`px-2 py-1 rounded ${isActive(() => editor?.isActive({ textAlign: "right" }))}`}
                  >
                    <AlignRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().undo().run()}
                    className={`px-2 py-1 rounded ${isActive(() => false)}`}
                    disabled={!editor?.can().undo()}
                  >
                    <Undo className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().redo().run()}
                    className={`px-2 py-1 rounded ${isActive(() => false)}`}
                    disabled={!editor?.can().redo()}
                  >
                    <Redo className="w-5 h-5" />
                  </button>
                </div>
                <EditorContent
                  editor={editor}
                  className="p-2 min-h-[150px] focus-within:outline-none bg-white/50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="video"
                className="text-sm font-semibold text-[#195a5a]"
              >
                Video File
              </Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-[#195a5a]/30 bg-white/70 rounded-lg p-6 text-center transition-all duration-300 ${
                  isDragActive ? "bg-[#e6f4ea] border-[#195a5a]/50" : ""
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  {localVideoUrl || videoUrl ? (
                    <div className="relative w-full max-w-md">
                      <video
                        src={localVideoUrl || videoUrl || ""}
                        controls
                        className="w-full rounded-lg shadow-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVideo();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto text-[#195a5a] w-16 h-16 mb-2 animate-pulse" />
                      <p className="text-lg text-[#2a7b7b] mb-2">
                        Drop your video file here or click to upload
                      </p>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="border-[#195a5a]/30 bg-white/80 text-[#195a5a] hover:bg-[#195a5a] hover:text-white transition-all duration-300 shadow-md"
                  >
                    Select Video
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              onClick={handleSubmit}
              disabled={pending}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Lesson
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}