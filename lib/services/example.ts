import apiClient from "@/lib/api-client";

export const homePageService = {
  async getHomePageData() {
    const response = await apiClient.get("/home-page");
    return response.data;
  },

  // Just an example to delete user, you can remove if not needed
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },
};
