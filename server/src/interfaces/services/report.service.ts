export default interface IReportService {
  mostBorrowedBooks(limit?: number): Promise<Array<{ title: string; author: string; borrowCount: number }>>;
  activeMembers(limit?: number): Promise<Array<{ name: string; email: string; borrowCount: number }>>;
  bookAvailabilitySummary(): Promise<{ totalBooks: number; borrowedBooks: number; availableBooks: number }>;
}