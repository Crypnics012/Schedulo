export const findingsData = {
  security: {
    title: "Security Vulnerabilities",
    summary: "The audit identified several critical security vulnerabilities that could compromise user data and social media accounts.",
    icon: "shield",
    findings: [
      {
        title: "Insecure Token Storage",
        description: "Social media access tokens were stored without proper encryption, creating a significant security risk. Tokens could be exposed in case of a database breach, potentially giving attackers access to users' social media accounts.",
        severity: "Critical",
        impact: "Unauthorized access to users' social media accounts, potential data breaches, and reputation damage.",
        recommendation: "Implement secure token storage with AES-256-GCM encryption and proper key management."
      },
      {
        title: "Missing API Rate Limiting",
        description: "No mechanism existed to prevent exceeding platform-specific rate limits, risking account suspensions and API access revocation. This could lead to service disruptions and poor user experience.",
        severity: "High",
        impact: "Account suspensions, service disruptions, and potential permanent API access revocation.",
        recommendation: "Implement platform-specific rate limiting with proper tracking and throttling mechanisms."
      },
      {
        title: "Inadequate Authentication Controls",
        description: "The application relied solely on basic OAuth without additional security measures like multi-factor authentication or session management. This increased the risk of account takeovers.",
        severity: "High",
        impact: "Increased vulnerability to account takeovers and unauthorized access.",
        recommendation: "Enhance authentication with multi-factor authentication, proper session management, and secure token handling."
      },
      {
        title: "Unencrypted Data Transmission",
        description: "Some API requests containing sensitive information were not properly encrypted during transmission, potentially exposing user data to interception.",
        severity: "Medium",
        impact: "Potential exposure of sensitive user data during transmission.",
        recommendation: "Ensure all API requests use HTTPS and implement proper encryption for sensitive data."
      }
    ],
    improvements: [
      {
        title: "Secure Token Management System",
        description: "Implemented AES-256-GCM encryption for all social media tokens with unique initialization vectors and authentication tags.",
        details: "The secure token management system encrypts tokens before storage and decrypts them only when needed, ensuring they're never exposed in plaintext in the database."
      },
      {
        title: "Airtable Token Store Integration",
        description: "Developed secure storage backend for encrypted tokens with proper lifecycle management.",
        details: "The Airtable token store handles token creation, retrieval, updating, and deletion with proper security controls and monitoring."
      },
      {
        title: "API Rate Limiter",
        description: "Created platform-specific rate limit configurations with request tracking and throttling.",
        details: "The rate limiter prevents exceeding API limits by tracking usage across different time windows and throttling requests when necessary."
      }
    ]
  },
  performance: {
    title: "Performance Bottlenecks",
    summary: "The audit revealed significant performance bottlenecks that could impact user experience, especially when handling bulk operations.",
    icon: "zap",
    findings: [
      {
        title: "Inefficient Bulk Upload",
        description: "The bulk upload system couldn't efficiently handle 90 simultaneous uploads, leading to timeouts, failures, and poor user experience. Files were processed sequentially, causing long wait times.",
        severity: "Critical",
        impact: "Long processing times, timeouts, and failed uploads when handling multiple files.",
        recommendation: "Implement a chunked upload system with concurrent processing and proper progress tracking."
      },
      {
        title: "Missing Chunked Upload",
        description: "Large files were uploaded in a single request, causing timeouts and failures, especially on slower connections. This made the application unreliable for users with larger media files.",
        severity: "High",
        impact: "Failed uploads for large files and poor experience on slower connections.",
        recommendation: "Implement chunked uploads with proper resumability for large files."
      },
      {
        title: "No Progress Tracking",
        description: "Users had no visibility into upload progress for large batches, leading to uncertainty and perceived application unresponsiveness. This resulted in users often abandoning uploads or refreshing the page, causing further issues.",
        severity: "Medium",
        impact: "Poor user experience and uncertainty during upload operations.",
        recommendation: "Add comprehensive progress tracking and status reporting for all operations."
      },
      {
        title: "Inefficient Database Queries",
        description: "Database queries were not optimized, resulting in slow response times for pages displaying large amounts of scheduled content.",
        severity: "Medium",
        impact: "Slow page loads and poor performance when viewing schedules with many items.",
        recommendation: "Optimize database queries with proper indexing and pagination."
      }
    ],
    improvements: [
      {
        title: "Bulk Upload Processor",
        description: "Implemented chunked uploads for large files with concurrent processing capabilities.",
        details: "The bulk upload processor breaks files into manageable chunks, processes multiple uploads concurrently, and provides detailed progress tracking."
      },
      {
        title: "Progress Tracking System",
        description: "Added comprehensive progress tracking and status reporting for all upload operations.",
        details: "Users now have real-time visibility into upload progress, with detailed status information and error reporting."
      },
      {
        title: "Optimized Media Processing",
        description: "Implemented asynchronous media processing with background tasks for handling transformations.",
        details: "Media processing now happens in the background, allowing users to continue working while files are processed."
      }
    ]
  },
  "error-handling": {
    title: "Error Handling Deficiencies",
    summary: "The audit identified significant gaps in error handling that could lead to system instability and poor user experience.",
    icon: "alert-triangle",
    findings: [
      {
        title: "Inadequate Error Recovery",
        description: "No systematic approach existed for handling and recovering from errors, leading to cascading failures and system instability. When one component failed, it often caused other components to fail as well.",
        severity: "Critical",
        impact: "System instability, data loss, and poor user experience during failures.",
        recommendation: "Implement comprehensive error recovery mechanisms with proper categorization and handling."
      },
      {
        title: "Missing Circuit Breakers",
        description: "The application lacked protection against cascading failures when external services failed. Continued attempts to call failing services exacerbated issues and impacted overall system performance.",
        severity: "High",
        impact: "Cascading failures and system-wide performance degradation when external services fail.",
        recommendation: "Implement circuit breaker patterns for all external service calls."
      },
      {
        title: "Limited Retry Logic",
        description: "Inconsistent retry mechanisms existed across the application, with some operations failing permanently on first attempt while others retried indefinitely, causing resource exhaustion.",
        severity: "Medium",
        impact: "Unnecessary failures for transient issues and resource exhaustion from excessive retries.",
        recommendation: "Implement consistent retry mechanisms with exponential backoff and proper failure handling."
      },
      {
        title: "Poor Error Reporting",
        description: "Error messages were often generic and unhelpful, making it difficult for users to understand and resolve issues. This led to increased support requests and user frustration.",
        severity: "Medium",
        impact: "User confusion, increased support burden, and difficulty troubleshooting issues.",
        recommendation: "Improve error reporting with clear, actionable messages and proper logging."
      }
    ],
    improvements: [
      {
        title: "Error Recovery System",
        description: "Implemented comprehensive error categorization and handling with proper recovery strategies.",
        details: "The error recovery system categorizes errors by type and applies appropriate recovery strategies based on the error category."
      },
      {
        title: "Circuit Breaker Implementation",
        description: "Created circuit breaker pattern for external service calls to prevent cascading failures.",
        details: "Circuit breakers monitor for failures and automatically open to prevent further calls to failing services, with automatic recovery when services return to normal."
      },
      {
        title: "Retry Mechanism",
        description: "Implemented configurable retry attempts with exponential backoff and jitter.",
        details: "The retry mechanism automatically attempts to recover from transient failures with increasing delays between attempts to prevent overwhelming services."
      }
    ]
  },
  testing: {
    title: "Testing Gaps",
    summary: "The audit revealed significant gaps in testing that could lead to quality issues and regressions in production.",
    icon: "code",
    findings: [
      {
        title: "Missing Automated Tests",
        description: "No comprehensive testing strategy or framework existed, making it difficult to ensure code quality and prevent regressions. Changes were often deployed without proper testing, leading to production issues.",
        severity: "Critical",
        impact: "Frequent regressions, quality issues, and production incidents.",
        recommendation: "Implement a comprehensive automated testing framework with unit, integration, and end-to-end tests."
      },
      {
        title: "No Mock APIs",
        description: "The inability to test API integrations without live connections made testing unreliable and dependent on external services. This led to flaky tests and difficulty testing error scenarios.",
        severity: "High",
        impact: "Unreliable tests, difficulty testing error scenarios, and dependency on external services for testing.",
        recommendation: "Implement mock APIs for testing without real API calls."
      },
      {
        title: "Limited Test Coverage",
        description: "There was no way to ensure code quality or prevent regressions, as test coverage was minimal or non-existent for critical components.",
        severity: "High",
        impact: "Undetected bugs, quality issues, and regressions in production.",
        recommendation: "Increase test coverage for critical components and implement coverage reporting."
      },
      {
        title: "Manual Testing Burden",
        description: "Heavy reliance on manual testing created a bottleneck in the development process and increased the risk of human error.",
        severity: "Medium",
        impact: "Development bottlenecks, increased time to market, and higher risk of human error.",
        recommendation: "Reduce manual testing burden through automation and improved test infrastructure."
      }
    ],
    improvements: [
      {
        title: "Automated Testing Framework",
        description: "Created test suite organization and execution with before/after hooks for setup and teardown.",
        details: "The testing framework provides a structured approach to organizing and running tests, with proper setup and teardown capabilities."
      },
      {
        title: "API Testing Utilities",
        description: "Implemented mock API for testing without real API calls and request/response handling.",
        details: "Mock APIs allow testing of API integrations without depending on external services, making tests more reliable and comprehensive."
      },
      {
        title: "Example Test Suites",
        description: "Created comprehensive test suites for all critical components.",
        details: "Example test suites demonstrate proper testing techniques and provide a foundation for expanding test coverage."
      }
    ]
  }
};
