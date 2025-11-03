import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, slugify } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
      expect(cn("foo", undefined, "bar")).toBe("foo bar");
      expect(cn("foo", false && "bar")).toBe("foo");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency correctly for VND", () => {
      expect(formatCurrency(1000000)).toContain("1.000.000");
      expect(formatCurrency(50000)).toContain("50.000");
      expect(formatCurrency(0)).toContain("0");
    });

    it("should handle custom currency", () => {
      const result = formatCurrency(100, "USD");
      expect(result).toContain("100");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15");
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(result).toContain("2024");
    });

    it("should handle string dates", () => {
      const result = formatDate("2024-01-15");
      expect(result).toBeTruthy();
    });
  });

  describe("slugify", () => {
    it("should convert text to slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Product Name 123")).toBe("product-name-123");
    });

    it("should handle Vietnamese characters", () => {
      expect(slugify("Sản phẩm")).toBe("san-pham");
    });

    it("should remove special characters", () => {
      expect(slugify("Product & Item!")).toBe("product-item");
    });

    it("should handle multiple spaces", () => {
      expect(slugify("Multiple   Spaces")).toBe("multiple-spaces");
    });
  });
});

