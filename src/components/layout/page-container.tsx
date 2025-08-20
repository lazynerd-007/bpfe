import React from "react"
import {SidebarTrigger} from "@/components/ui/sidebar"
import {Separator} from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
    BreadcrumbItem
} from "@/components/ui/breadcrumb"
import {cn} from "@/lib/utils"


interface BreadCrumbsProps {
    children: React.ReactNode
    disableLastTwoEllipsis?: boolean
}

interface ActionsProps {
    children: React.ReactNode
}


const BreadCrumbs = ({children, disableLastTwoEllipsis}: BreadCrumbsProps) => {
    return <>{children}</>
}

const Actions = ({children}: ActionsProps) => {
    return <>{children}</>
}


interface PageHeaderComponent extends React.ForwardRefExoticComponent<
    { children?: React.ReactNode } & React.RefAttributes<HTMLElement>
> {
    BreadCrumbs: typeof BreadCrumbs
    Actions: typeof Actions
}

export const PageHeader = React.forwardRef<
    HTMLElement,
    { children?: React.ReactNode }
>(({children}, ref) => {

    const breadCrumbsComponent = children ? React.Children.toArray(children).find(
        (child): child is React.ReactElement<BreadCrumbsProps> =>
            React.isValidElement(child) && child.type === BreadCrumbs
    ) : undefined

    const actionsComponent = children ? React.Children.toArray(children).find(
        (child): child is React.ReactElement<ActionsProps> =>
            React.isValidElement(child) && child.type === Actions
    ) : undefined


    const processBreadcrumbs = (breadcrumbChildren: React.ReactNode, disableLastTwoEllipsis?: boolean) => {
        const items = React.Children.toArray(breadcrumbChildren).filter(Boolean)

        if (items.length <= 3 || disableLastTwoEllipsis) {
            return items.map((item, index) => (
                <React.Fragment key={index}>
                    <BreadcrumbItem>
                        {item}
                    </BreadcrumbItem>
                    {index < items.length - 1 && <BreadcrumbSeparator/>}
                </React.Fragment>
            ))
        }

        const result: React.ReactNode[] = []

        result.push(
            <React.Fragment key="first">
                <BreadcrumbItem>
                    {items[0]}
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
            </React.Fragment>
        )

        result.push(
            <React.Fragment key="ellipsis">
                <BreadcrumbItem>
                    <BreadcrumbEllipsis/>
                </BreadcrumbItem>
                <BreadcrumbSeparator/>
            </React.Fragment>
        )

        const lastTwoItems = items.slice(-2)
        lastTwoItems.forEach((item, index) => {
            result.push(
                <React.Fragment key={`last-${index}`}>
                    <BreadcrumbItem>
                        {item}
                    </BreadcrumbItem>
                    {index < lastTwoItems.length - 1 && <BreadcrumbSeparator/>}
                </React.Fragment>
            )
        })

        return result
    }

    return (
        <header
            ref={ref}
            className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
        >
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1"/>
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {!!breadCrumbsComponent ? processBreadcrumbs(breadCrumbsComponent.props.children, breadCrumbsComponent.props.disableLastTwoEllipsis) : null}
                    </BreadcrumbList>
                </Breadcrumb>

                {actionsComponent && (
                    <div className="ml-auto flex items-center gap-2">
                        {actionsComponent.props.children}
                    </div>
                )}
            </div>
        </header>
    )
}) as PageHeaderComponent

PageHeader.displayName = "PageHeader"
PageHeader.BreadCrumbs = BreadCrumbs
PageHeader.Actions = Actions


export const PageContainer = ({
                                  children,
                                  className
                              }: {
    children: React.ReactNode
    className?: string
}) => {
    const childrenArray = React.Children.toArray(children)

    const pageHeaderComponent = childrenArray.find(
        (child): child is React.ReactElement =>
            React.isValidElement(child) && child.type === PageHeader
    )

    const pageContent = childrenArray.filter(
        (child) => !(React.isValidElement(child) && child.type === PageHeader)
    )

    return (
        <>
            {pageHeaderComponent}
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className={cn("flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6", className)}>
                        {pageContent}
                    </div>
                </div>
            </div>
        </>
    )
}

export {
    Actions,
    BreadCrumbs,
    BreadcrumbPage,
    BreadcrumbLink
}