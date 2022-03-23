import click
import indicators.task_help as task_help

@click.group()
def cli():
    pass

@click.command(name='all_scraping')
def initdb():
    task_help.step1()
    task_help.step2()
    task_help.step3()

@click.command(name='migrate:step1')
def migrateStep1():
    task_help.step1()

@click.command(name='migrate:step2')
def migrateStep2():
    task_help.step2()

@click.command(name='migrate:step3')
def migrateStep3():
    task_help.step3()

cli.add_command(initdb)
cli.add_command(migrateStep1)
cli.add_command(migrateStep2)
cli.add_command(migrateStep3)

if __name__ == '__main__':
    cli()