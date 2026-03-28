"use server";

import { api } from "@/lib/api-client";

export async function getMyPage() {
  try {
    return await api.get("/page/me");
  } catch (error) {
    return null;
  }
}

export async function createPage(data: { themeId: string; title: string }) {
  return await api.post("/page", data);
}

export async function updatePage(id: string, data: any) {
  return await api.patch(`/page/${id}`, data);
}

export async function createWidget(data: any) {
  return await api.post("/widget", data);
}

export async function updateWidget(id: string, data: any) {
  return await api.patch(`/widget/${id}`, data);
}

export async function deleteWidget(id: string) {
  return await api.delete(`/widget/${id}`);
}

export async function syncPage(data: { themeConfig?: any; widgets?: any[]; isPublished?: boolean }) {
  return await api.post("/page/sync", data);
}

export async function getPageByUsername(username: string) {
  try {
    return await api.get(`/page/${username}`);
  } catch (error) {
    return null;
  }
}
