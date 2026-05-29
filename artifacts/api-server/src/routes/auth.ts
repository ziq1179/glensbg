import { Router, type IRouter } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db, staffUsersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const LoginBody = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const { username, password } = parsed.data;

  const [user] = await db
    .select()
    .from(staffUsersTable)
    .where(eq(staffUsersTable.username, username))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session.staffUser = {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
  };

  req.log.info({ username: user.username }, "Staff login successful");
  res.json({ id: user.id, username: user.username, displayName: user.displayName });
});

router.post("/auth/logout", requireAuth, (req, res): void => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/auth/me", (req, res): void => {
  if (!req.session.staffUser) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(req.session.staffUser);
});

export default router;
