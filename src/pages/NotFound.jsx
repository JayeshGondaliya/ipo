import { Link } from 'react-router-dom';

export default function NotFound() {
    return <section className="py-16 text-center"><p className="text-sm font-medium text-emerald-600">404</p><h1 className="mt-2 text-2xl font-semibold text-slate-800">Page not found</h1><Link className="mt-5 inline-block text-sm text-emerald-600 hover:text-emerald-700 font-medium" to="/">Return to IPOGMP Home</Link></section>;
}