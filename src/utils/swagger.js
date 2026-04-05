const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'A RESTful backend for a finance dashboard system with role-based access control, financial record management, and analytics.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      },
      {
        url: 'https://finance-backend-6fug.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '88897e8a-9b89-4ade-bacc-196f449b3200' },
            name: { type: 'string', example: 'Admin User' },
            email: { type: 'string', example: 'admin@test.com' },
            role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'] },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number', example: 5000 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            category: { type: 'string', example: 'Salary' },
            date: { type: 'string', format: 'date-time' },
            description: { type: 'string', example: 'Monthly salary' },
            deletedAt: { type: 'string', nullable: true },
            userId: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Records', description: 'Financial record management' },
      { name: 'Dashboard', description: 'Analytics and summary data' },
      { name: 'Users', description: 'User management (Admin only)' }
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Admin User' },
                    email: { type: 'string', example: 'admin@test.com' },
                    password: { type: 'string', example: 'admin123' },
                    role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], example: 'ADMIN' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: { '$ref': '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            409: { description: 'Email already registered' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and get JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'admin@test.com' },
                    password: { type: 'string', example: 'admin123' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          token: { type: 'string' },
                          user: { '$ref': '#/components/schemas/User' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/api/records': {
        get: {
          tags: ['Records'],
          summary: 'Get all records with filters and pagination',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
          ],
          responses: {
            200: {
              description: 'List of records',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          records: { type: 'array', items: { '$ref': '#/components/schemas/FinancialRecord' } },
                          total: { type: 'integer' },
                          page: { type: 'integer' },
                          totalPages: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Records'],
          summary: 'Create a new record (ANALYST, ADMIN)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount', 'type', 'category', 'date'],
                  properties: {
                    amount: { type: 'number', example: 5000 },
                    type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                    category: { type: 'string', example: 'Salary' },
                    date: { type: 'string', example: '2024-04-01' },
                    description: { type: 'string', example: 'Monthly salary' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Record created' },
            400: { description: 'Validation failed' },
            403: { description: 'Access denied' }
          }
        }
      },
      '/api/records/{id}': {
        get: {
          tags: ['Records'],
          summary: 'Get record by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Record found' },
            404: { description: 'Record not found' }
          }
        },
        patch: {
          tags: ['Records'],
          summary: 'Update a record (ANALYST, ADMIN)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    amount: { type: 'number' },
                    type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                    category: { type: 'string' },
                    date: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Record updated' },
            404: { description: 'Record not found' }
          }
        },
        delete: {
          tags: ['Records'],
          summary: 'Soft delete a record (ADMIN only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Record deleted' },
            404: { description: 'Record not found' }
          }
        }
      },
      '/api/dashboard/summary': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get total income, expenses and net balance',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Summary data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          totalIncome: { type: 'number', example: 5000 },
                          totalExpenses: { type: 'number', example: 2000 },
                          netBalance: { type: 'number', example: 3000 }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/dashboard/by-category': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get totals grouped by category',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Category breakdown' } }
        }
      },
      '/api/dashboard/trends': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get monthly income vs expenses (last 6 months)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Monthly trends' } }
        }
      },
      '/api/dashboard/recent': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get last 10 transactions',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Recent activity' } }
        }
      },
      '/api/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users (ADMIN only)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of users' }, 403: { description: 'Access denied' } }
        }
      },
      '/api/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID (ADMIN only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User found' }, 404: { description: 'User not found' } }
        },
        patch: {
          tags: ['Users'],
          summary: 'Update user role or status (ADMIN only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'] },
                    status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
                    name: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'User updated' } }
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user (ADMIN only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User deleted' } }
        }
      }
    }
  },
  apis: []
}

const swaggerSpec = swaggerJsdoc(options)
module.exports = swaggerSpec