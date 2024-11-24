export const POST = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { password, path } = data;

    // 在实际应用中，这里应该进行密码验证
    const safePath = path.replace(/[^a-zA-Z0-9]/g, "_");
    const cookieName = `article_auth_${safePath}`;

    cookies.set(cookieName, "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Password validation error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Invalid password" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
