import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { connectWebSocket } from "@/lib/websocket";
import type { Comment } from "@shared/schema";

interface CommentsProps {
  comments: Comment[];
}

export default function Comments({ comments: initialComments }: CommentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    const ws = connectWebSocket();
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_comment') {
          setComments(prev => [data.data, ...prev]);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/comments", { content });
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    },
  });

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return "Just now";
    }
  };

  // Sample comments if no real data
  const displayComments = comments.length > 0 ? comments : [
    {
      id: 1,
      content: "Great progress on the LinkedIn campaigns! The engagement rates are exceeding our expectations.",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      user: {
        firstName: "Sarah",
        lastName: "Johnson",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612a1a7?w=150&h=150&fit=crop&crop=face",
        role: "Account Manager",
      },
    },
    {
      id: 2,
      content: "Thanks for the update! Can we schedule a call to discuss the Q4 strategy?",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: {
        firstName: user?.firstName || "You",
        lastName: user?.lastName || "",
        profileImageUrl: user?.profileImageUrl,
        role: "Client",
      },
    },
  ];

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {displayComments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={comment.user?.profileImageUrl} 
                  alt={comment.user?.firstName || "User"} 
                />
                <AvatarFallback>
                  {comment.user?.firstName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {comment.user?.firstName || "User"} 
                  {comment.user?.role && ` (${comment.user.role})`} • {" "}
                  {formatTimeAgo(comment.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "You"} />
              <AvatarFallback>
                {user?.firstName?.[0] || user?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={handlePostComment}
                  disabled={!newComment.trim() || commentMutation.isPending}
                  size="sm"
                >
                  {commentMutation.isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
