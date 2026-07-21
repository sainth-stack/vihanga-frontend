const humanizeFieldName = (fieldPath = "") => {
  const fieldName = fieldPath.includes(".")
    ? fieldPath.split(".").pop()
    : fieldPath;

  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

const prettifyApiMessage = (message) => {
  if (!message || typeof message !== "string") {
    return message;
  }

  const castMatch = message.match(
    /^Cast to (\w+) failed for value "(.*?)" \(type \w+\) at path "(.+)"$/
  );
  if (castMatch) {
    const [, kind, value, path] = castMatch;
    const field = humanizeFieldName(path);
    return `Invalid value for "${field}". Expected a valid ${kind.toLowerCase()}, but received "${value}".`;
  }

  const requiredMatch = message.match(/^Path `(.+)` is required\.?$/);
  if (requiredMatch) {
    const field = humanizeFieldName(requiredMatch[1]);
    return `"${field}" is required.`;
  }

  if (message.startsWith("Validation failed:")) {
    return message.replace(/^Validation failed:\s*/, "");
  }

  return message;
};

export const getApiErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || fallback;
  }

  if (Array.isArray(data.errors)) {
    const messages = data.errors
      .map((entry) =>
        typeof entry === "string" ? entry : entry?.message || entry?.msg
      )
      .filter(Boolean)
      .map(prettifyApiMessage);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if (Array.isArray(data.message)) {
    return data.message.map(prettifyApiMessage).join(" ");
  }

  const message =
    data.message ||
    data.error?.message ||
    (typeof data.error === "string" ? data.error : null);

  if (message) {
    return prettifyApiMessage(message);
  }

  return fallback;
};
