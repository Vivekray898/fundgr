// app/(client)/wishlist/page.tsx
import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import Container from "@/components/Container";

const WishListPage = async () => {
  const user = await currentUser();
  
  return (
    <Container className="py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Meine Wunschliste
        </span>
      </h1>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Melden Sie sich an, um Ihre Wunschliste einzusehen. Verpassen Sie nicht Ihre Lieblingsprodukte!" />
      )}
    </Container>
  );
};

export default WishListPage;