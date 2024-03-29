import prisma from '@/services/prisma';
import getComments from '@/app/getComment/page';

export async function POST(request) {
  try {
      const { anime_mal_id, user_email, comment, username, anime_title, rating, date } = await request.json();

      // const user = await prisma.user.findFirst({
      //     where: {
      //         email: user.email
      //     }
      // })
      // if (!user) {
      //   return Response.json({ status: 404, error: "Account not found" });
      // }
      
      const user = await prisma.user.findUnique({
        where: {
          email: user_email
        },
        select: {
          id: true
        }
      });
  
      if (!user) {
        return Response.json({ status: 404, error: "User not found" });
      }


      // const userId = user.id;

      const createComment = await prisma.comment.create({
          data: {
              anime_mal_id,
              user_email,
              comment,
              username,
              anime_title,
              rating,
              date,
              userId: user.id 
          },
      });
      if(createComment) return Response.json({ status: 201, isCreated: true });
  } catch(error) {
      console.error("Error creating comment:", error);
      return Response.json({ status: 500, error: "Internal Server Error" });
  }
}


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('anime_mal_id');
    if (!query) {
      // Jika anime_mal_id tidak ada, kembalikan 400 Bad Request
      return Response.json({ status: 400, error: "Bad Request: Ups Sorry Your Anime mal id is empty" });
    }
    const comments = await getComments(query);
    return Response.json({ comments });
  } catch (error) {
    console.error("Error retrieving comments:", error);
    return Response.json({ status: 500, error: "Internal Server Error" });
  }
}
