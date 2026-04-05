import type { SocialPlatform } from "@/types/components/dashboard/widgets";

export type ApiResponse<T> = {
	success: boolean;
	code: number;
	message: string;
	result: T;
};

export type UserRole = "ADMIN" | "USER";

export interface User {
	id: string;
	email: string;
	fullName: string;
	username: string | null;
	role: UserRole;
	tnc: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	user: User;
	token: string;
}

export type PublicPageInfo = {
	slug: string;
	title: string;
};

export type PublicThemeStyleConfig = {
	activeWallpaper: string;
	activeFont: string;
	frostIntensity: number;
	surfaceTint: number;
};

export type PublicThemeResult = {
	page: PublicPageInfo;
	styleConfig: PublicThemeStyleConfig;
};

export type PublicWidgetApiItem = {
	id: string;
	type: SocialPlatform;
	handle: string;
	startCol: number;
	startRow: number;
	colSize: number;
	rowSize: number;
};

export type PublicWidgetsResult = {
	widgets: PublicWidgetApiItem[];
};
