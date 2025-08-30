// Copyright 2025 The Flutter Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { z } from "./genkit";

/**
 * Recursively converts a JSON Schema-like object into a Zod schema.
 * This is a simplified converter that handles the specific structures
 * used by the genui_client's Catalog.
 *
 * @param schema The JSON Schema-like object to convert.
 * @returns A Zod schema.
 */
export function jsonSchemaToZod(schema: any): z.ZodTypeAny {
  // Handle unions (anyOf)
  if (schema.anyOf) {
    const options = schema.anyOf.map((s: any) => jsonSchemaToZod(s));
    // Using discriminatedUnion requires a common field, which our widget
    // wrapper doesn't have. A simple union is the correct Zod equivalent here.
    return z.union(options);
  }

  // Handle combined schemas (used for the top-level widget wrapper)
  if (schema.combined) {
    return jsonSchemaToZod(schema.combined);
  }

  const type = schema.type || (schema.properties ? 'object' : undefined);

  let zodSchema: z.ZodTypeAny;

  switch (type) {
    case 'string':
      zodSchema = schema.enumValues
        ? z.enum(schema.enumValues)
        : z.string();
      break;
    case 'number':
      zodSchema = z.number();
      break;
    case 'integer':
      zodSchema = z.number().int();
      break;
    case 'boolean':
      zodSchema = z.boolean();
      break;
    case 'array':
    case 'list':
      if (!schema.items) {
        throw new Error('Schema of type "array" must have an "items" property.');
      }
      zodSchema = z.array(jsonSchemaToZod(schema.items));
      break;
    case 'object':
      const shape: z.ZodRawShape = {};
      if (schema.properties) {
        for (const key in schema.properties) {
          shape[key] = jsonSchemaToZod(schema.properties[key]);
        }
      }
      // In JSON schema, properties are optional by default unless in 'required'.
      // In Zod, they are required by default unless marked '.optional()'.
      const required = new Set(schema.required || []);
      for (const key in shape) {
        if (!required.has(key)) {
          shape[key] = shape[key].optional();
        }
      }
      zodSchema = z.object(shape);
      break;
    default:
      // Fallback for unknown types.
      return z.any();
  }

  if (schema.description) {
    return zodSchema.describe(schema.description);
  }

  return zodSchema;
}
