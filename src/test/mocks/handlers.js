import { http, HttpResponse } from 'msw'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const handlers = [
  // Auth - Register
  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      user: {
        id: '1',
        email: body.email,
        name: body.name,
        role: body.role,
      },
      token: 'mock-jwt-token',
    }, { status: 201 })
  }),

  // Auth - Login
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      user: {
        id: '1',
        email: body.email,
        name: 'Test User',
        role: 'client',
      },
      token: 'mock-jwt-token',
    })
  }),

  // Get Chefs
  http.get(`${API_URL}/chefs`, () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Chef Mario',
        bio: 'Italian cuisine specialist',
        cuisines: ['Italian', 'Mediterranean'],
        hourlyRate: 50,
        location: 'New York',
        rating: 4.8,
        photo: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        name: 'Chef Sushi',
        bio: 'Japanese master chef',
        cuisines: ['Japanese', 'Asian'],
        hourlyRate: 60,
        location: 'Los Angeles',
        rating: 4.9,
        photo: 'https://via.placeholder.com/150',
      },
    ])
  }),

  // Get Single Chef
  http.get(`${API_URL}/chefs/:id`, ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'Chef Mario',
      bio: 'Italian cuisine specialist with 10 years experience',
      cuisines: ['Italian', 'Mediterranean'],
      hourlyRate: 50,
      location: 'New York',
      rating: 4.8,
      photo: 'https://via.placeholder.com/150',
      availability: ['2025-12-10', '2025-12-11', '2025-12-12'],
    })
  }),

  // Create Booking
  http.post(`${API_URL}/bookings`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: '1',
      chefId: body.chefId,
      clientId: '1',
      date: body.date,
      time: body.time,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }, { status: 201 })
  }),

  // Get User Bookings
  http.get(`${API_URL}/bookings`, () => {
    return HttpResponse.json([
      {
        id: '1',
        chefId: '1',
        chefName: 'Chef Mario',
        date: '2025-12-10',
        time: '18:00',
        status: 'pending',
      },
      {
        id: '2',
        chefId: '2',
        chefName: 'Chef Sushi',
        date: '2025-12-12',
        time: '19:00',
        status: 'confirmed',
      },
    ])
  }),

  // Update Booking Status (Chef accept/decline)
  http.patch(`${API_URL}/bookings/:id`, async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: params.id,
      status: body.status,
      updatedAt: new Date().toISOString(),
    })
  }),
]