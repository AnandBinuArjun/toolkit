"use client";

import React, { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const HTTP_STATUS_CODES = [
  // 1xx Informational
  { code: 100, phrase: "Continue", description: "The server has received the request headers, and the client should proceed to send the request body.", class: "1xx" },
  { code: 101, phrase: "Switching Protocols", description: "The requester has asked the server to switch protocols.", class: "1xx" },
  { code: 102, phrase: "Processing", description: "A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request.", class: "1xx" },
  { code: 103, phrase: "Early Hints", description: "Used to return some response headers before final HTTP message.", class: "1xx" },
  
  // 2xx Success
  { code: 200, phrase: "OK", description: "Standard response for successful HTTP requests.", class: "2xx" },
  { code: 201, phrase: "Created", description: "The request has been fulfilled, resulting in the creation of a new resource.", class: "2xx" },
  { code: 202, phrase: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed.", class: "2xx" },
  { code: 203, phrase: "Non-Authoritative Information", description: "The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin's response.", class: "2xx" },
  { code: 204, phrase: "No Content", description: "The server successfully processed the request and is not returning any content.", class: "2xx" },
  { code: 205, phrase: "Reset Content", description: "The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.", class: "2xx" },
  { code: 206, phrase: "Partial Content", description: "The server is delivering only part of the resource (byte serving) due to a range header sent by the client.", class: "2xx" },
  { code: 207, phrase: "Multi-Status", description: "The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.", class: "2xx" },
  { code: 208, phrase: "Already Reported", description: "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.", class: "2xx" },
  { code: 226, phrase: "IM Used", description: "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.", class: "2xx" },

  // 3xx Redirection
  { code: 300, phrase: "Multiple Choices", description: "Indicates multiple options for the resource from which the client may choose.", class: "3xx" },
  { code: 301, phrase: "Moved Permanently", description: "This and all future requests should be directed to the given URI.", class: "3xx" },
  { code: 302, phrase: "Found", description: "Tells the client to look at (browse to) another URL.", class: "3xx" },
  { code: 303, phrase: "See Other", description: "The response to the request can be found under another URI using the GET method.", class: "3xx" },
  { code: 304, phrase: "Not Modified", description: "Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.", class: "3xx" },
  { code: 305, phrase: "Use Proxy", description: "The requested resource is available only through a proxy, the address for which is provided in the response.", class: "3xx" },
  { code: 307, phrase: "Temporary Redirect", description: "In this case, the request should be repeated with another URI; however, future requests should still use the original URI.", class: "3xx" },
  { code: 308, phrase: "Permanent Redirect", description: "The request and all future requests should be repeated using another URI.", class: "3xx" },

  // 4xx Client Error
  { code: 400, phrase: "Bad Request", description: "The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).", class: "4xx" },
  { code: 401, phrase: "Unauthorized", description: "Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.", class: "4xx" },
  { code: 402, phrase: "Payment Required", description: "Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme.", class: "4xx" },
  { code: 403, phrase: "Forbidden", description: "The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource, or may need an account of some sort.", class: "4xx" },
  { code: 404, phrase: "Not Found", description: "The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.", class: "4xx" },
  { code: 405, phrase: "Method Not Allowed", description: "A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST.", class: "4xx" },
  { code: 406, phrase: "Not Acceptable", description: "The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.", class: "4xx" },
  { code: 407, phrase: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy.", class: "4xx" },
  { code: 408, phrase: "Request Timeout", description: "The server timed out waiting for the request.", class: "4xx" },
  { code: 409, phrase: "Conflict", description: "Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.", class: "4xx" },
  { code: 410, phrase: "Gone", description: "Indicates that the resource requested is no longer available and will not be available again.", class: "4xx" },
  { code: 411, phrase: "Length Required", description: "The request did not specify the length of its content, which is required by the requested resource.", class: "4xx" },
  { code: 412, phrase: "Precondition Failed", description: "The server does not meet one of the preconditions that the requester put on the request.", class: "4xx" },
  { code: 413, phrase: "Payload Too Large", description: "The request is larger than the server is willing or able to process.", class: "4xx" },
  { code: 414, phrase: "URI Too Long", description: "The URI provided was too long for the server to process.", class: "4xx" },
  { code: 415, phrase: "Unsupported Media Type", description: "The request entity has a media type which the server or resource does not support.", class: "4xx" },
  { code: 416, phrase: "Range Not Satisfiable", description: "The client has asked for a portion of the file (byte serving), but the server cannot supply that portion.", class: "4xx" },
  { code: 417, phrase: "Expectation Failed", description: "The server cannot meet the requirements of the Expect request-header field.", class: "4xx" },
  { code: 418, phrase: "I'm a teapot", description: "This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324.", class: "4xx" },
  { code: 421, phrase: "Misdirected Request", description: "The request was directed at a server that is not able to produce a response.", class: "4xx" },
  { code: 422, phrase: "Unprocessable Entity", description: "The request was well-formed but was unable to be followed due to semantic errors.", class: "4xx" },
  { code: 423, phrase: "Locked", description: "The resource that is being accessed is locked.", class: "4xx" },
  { code: 424, phrase: "Failed Dependency", description: "The request failed because it depended on another request and that request failed.", class: "4xx" },
  { code: 425, phrase: "Too Early", description: "Indicates that the server is unwilling to risk processing a request that might be replayed.", class: "4xx" },
  { code: 426, phrase: "Upgrade Required", description: "The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.", class: "4xx" },
  { code: 428, phrase: "Precondition Required", description: "The origin server requires the request to be conditional.", class: "4xx" },
  { code: 429, phrase: "Too Many Requests", description: "The user has sent too many requests in a given amount of time. Intended for use with rate-limiting schemes.", class: "4xx" },
  { code: 431, phrase: "Request Header Fields Too Large", description: "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.", class: "4xx" },
  { code: 451, phrase: "Unavailable For Legal Reasons", description: "A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.", class: "4xx" },

  // 5xx Server Error
  { code: 500, phrase: "Internal Server Error", description: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.", class: "5xx" },
  { code: 501, phrase: "Not Implemented", description: "The server either does not recognize the request method, or it lacks the ability to fulfill the request.", class: "5xx" },
  { code: 502, phrase: "Bad Gateway", description: "The server was acting as a gateway or proxy and received an invalid response from the upstream server.", class: "5xx" },
  { code: 503, phrase: "Service Unavailable", description: "The server is currently unavailable (because it is overloaded or down for maintenance).", class: "5xx" },
  { code: 504, phrase: "Gateway Timeout", description: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.", class: "5xx" },
  { code: 505, phrase: "HTTP Version Not Supported", description: "The server does not support the HTTP protocol version used in the request.", class: "5xx" },
  { code: 506, phrase: "Variant Also Negotiates", description: "Transparent content negotiation for the request results in a circular reference.", class: "5xx" },
  { code: 507, phrase: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request.", class: "5xx" },
  { code: 508, phrase: "Loop Detected", description: "The server detected an infinite loop while processing a request with 'Depth: infinity'.", class: "5xx" },
  { code: 510, phrase: "Not Extended", description: "Further extensions to the request are required for the server to fulfill it.", class: "5xx" },
  { code: 511, phrase: "Network Authentication Required", description: "The client needs to authenticate to gain network access.", class: "5xx" },
];


export default function HttpStatusPage() {
  const tool = TOOLS.find((t) => t.id === "http-status")!;
  const [query, setQuery] = useState("");
  const [activeClass, setActiveClass] = useState<string | null>(null);

  const filteredCodes = useMemo(() => {
    return HTTP_STATUS_CODES.filter(status => {
      const matchesQuery = 
        status.code.toString().includes(query) || 
        status.phrase.toLowerCase().includes(query.toLowerCase());
      
      const matchesClass = activeClass ? status.class === activeClass : true;
      
      return matchesQuery && matchesClass;
    });
  }, [query, activeClass]);

  const getColorClass = (type: string) => {
    switch (type) {
      case "1xx": return "text-blue-600 bg-blue-400/10 border-blue-400/20";
      case "2xx": return "text-emerald-600 bg-green-400/10 border-green-400/20";
      case "3xx": return "text-amber-600 bg-yellow-400/10 border-yellow-400/20";
      case "4xx": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "5xx": return "text-rose-600 bg-red-400/10 border-red-400/20";
      default: return "text-text-primary";
    }
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-bg-base p-4 border border-border-line rounded-lg">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <Input
              type="text"
              placeholder="Search by code (e.g., 404) or phrase (e.g., Not Found)..."
              className="w-full bg-bg-panel border border-border-line rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveClass(null)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                activeClass === null 
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary" 
                  : "bg-bg-base border-border-line text-text-muted hover:border-text-muted"
              }`}
            >
              All
            </button>
            {["1xx", "2xx", "3xx", "4xx", "5xx"].map(cls => (
              <button
                key={cls}
                onClick={() => setActiveClass(cls)}
                className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                  activeClass === cls 
                    ? getColorClass(cls) 
                    : "bg-bg-base border-border-line text-text-muted hover:border-text-muted"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCodes.length > 0 ? (
            filteredCodes.map(status => (
              <div 
                key={status.code}
                className="bg-bg-panel border border-border-line rounded-lg p-4 flex flex-col hover:border-accent-primary transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xl font-bold font-mono px-2 py-1 rounded border ${getColorClass(status.class)}`}>
                    {status.code}
                  </span>
                  <h3 className="font-bold text-text-primary text-lg">
                    {status.phrase}
                  </h3>
                </div>
                <p className="text-sm text-text-muted mt-2">
                  {status.description}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 p-12 text-center border border-dashed border-border-line rounded-lg text-text-muted">
              No status codes found matching your search.
            </div>
          )}
        </div>

      </div>
    </ToolLayout>
  );
}