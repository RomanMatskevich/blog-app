import { Post } from "../types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Link from "next/link";




export default function ActionAreaCard({ post }: { post: Post }) {
  const formattedDate = (new Date(post.createdAt)).toDateString();
  const formattedDescriptionFromHtml = post.description.replace(/<[^>]*>/g, '').slice(0,15) + '...'
  return (
    <Card>
      <CardActionArea>
        <Link href = {`/post/${post._id}`}>
        <CardMedia
          component="img"
          height="140"
          image={`${process.env.NEXT_PUBLIC_SERVER_URI}/${post.image}`}
          alt="post image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {post.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {formattedDescriptionFromHtml}
          </Typography>
          <Typography variant="body2" sx={{ color: "black" }}>
            created: {formattedDate}
          </Typography>
        </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  );
}
