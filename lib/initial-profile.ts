import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    if (user.imageUrl !== profile.imageUrl || user.username !== profile.name) {
      await db.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          imageUrl: user.imageUrl,
          name: user.username!,
        },
      });
    }

    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: user.username!,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
