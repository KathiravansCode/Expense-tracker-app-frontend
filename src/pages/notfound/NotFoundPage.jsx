import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
        <Card className="w-full p-6 text-center">
          <div className="text-2xl font-semibold">Page not found</div>
          <div className="mt-2 text-sm text-gray-600">The page you’re looking for doesn’t exist.</div>
          <div className="mt-6 flex justify-center">
            <Button to="/" variant="secondary" size="sm">
              Go home
            </Button>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <Link to="/login" className="hover:text-gray-700">
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

